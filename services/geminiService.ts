import { Language } from '../types';
import { supabase } from './supabaseClient';

const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY as string || '';
// CANVI: De gemini-2.5-flash-lite a gemma-3-27b-it (14.400 RPD vs 20 RPD)
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent';

interface ChatHistory {
  role: 'user' | 'model';
  text: string;
}

interface BotConfig {
  name: string;
  tone: string;
  responseLength: string;
  highlightedProduct: string;
  businessHoursStart: string;
  businessHoursEnd: string;
  timezone: string;
  limitations: string[];
  qualifyingQuestions: string[];
  customInstructions: string;
  knowledgeBase: string[];
}

// Interfície per als leads capturats
export interface ChatbotLead {
  fullname?: string;
  phone?: string;
  email?: string;
  company?: string;
  proposed_date?: string;
  proposed_time?: string;
  interests?: string[];
  conversation_summary?: string;
  language?: string;
  // Camps de qualificació
  tech_level?: 'baix' | 'mig' | 'alt';
  interest_level?: 'fred' | 'tebi' | 'calent';
  company_size?: 'autonomo' | 'petita' | 'mitjana' | 'gran';
}

// Calcula puntuació del lead basada en qualificació
const calculateLeadScore = (lead: ChatbotLead): number => {
  let score = 0;

  // Dades de contacte (+30 màx)
  if (lead.phone) score += 15;
  if (lead.company) score += 10;
  if (lead.email) score += 5;

  // Cita programada (+20)
  if (lead.proposed_date && lead.proposed_time) score += 20;

  // Nivell d'interès (+30 màx)
  if (lead.interest_level === 'calent') score += 30;
  else if (lead.interest_level === 'tebi') score += 15;
  else if (lead.interest_level === 'fred') score += 5;

  // Mida empresa (+20 màx)
  if (lead.company_size === 'gran') score += 20;
  else if (lead.company_size === 'mitjana') score += 15;
  else if (lead.company_size === 'petita') score += 10;
  else if (lead.company_size === 'autonomo') score += 5;

  return Math.min(score, 100);
};

// Resultat de la resposta del chatbot
export interface ChatResponse {
  message: string;
  lead?: ChatbotLead;
}

let cachedBotConfig: BotConfig | null = null;
let configLastFetch: number = 0;
const CONFIG_CACHE_TTL = 5 * 60 * 1000;

let lastSavedLeadPhone: string | null = null;

export const loadBotConfig = async (): Promise<BotConfig | null> => {
  if (cachedBotConfig && Date.now() - configLastFetch < CONFIG_CACHE_TTL) {
    return cachedBotConfig;
  }

  try {
    const { data, error } = await supabase
      .from('bot_config')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.warn('⚠️ No s\'ha pogut carregar bot_config:', error.message);
      return null;
    }

    cachedBotConfig = {
      name: data.name || 'NEXI_tech',
      tone: data.tone || 'professional',
      responseLength: data.responselength || 'balanced',
      highlightedProduct: data.highlightedproduct || '',
      businessHoursStart: data.businesshoursstart || '09:00',
      businessHoursEnd: data.businesshoursend || '18:00',
      timezone: data.timezone || 'Europe/Madrid',
      limitations: data.limitations || [],
      qualifyingQuestions: data.qualifyingquestions || [],
      customInstructions: data.custominstructions || '',
      knowledgeBase: data.knowledgebase || []
    };
    
    configLastFetch = Date.now();
    return cachedBotConfig;
  } catch (err) {
    console.error('❌ Error carregant bot_config:', err);
    return null;
  }
};

const generateSystemPrompt = (config: BotConfig | null, lang: Language): string => {
  const botName = config?.name || 'NEXI_tech';

  // Data i hora actual per consciència temporal
  const now = new Date();
  const diasSemana = ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'];
  const mesos = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
  const diaSetmana = diasSemana[now.getDay()];
  const dia = now.getDate();
  const mes = mesos[now.getMonth()];
  const any = now.getFullYear();
  const hora = now.getHours().toString().padStart(2, '0');
  const minuts = now.getMinutes().toString().padStart(2, '0');
  const dataActual = `${diaSetmana}, ${dia} de ${mes} de ${any}, ${hora}:${minuts}h`;

  // Calcular dates futures per al prompt
  const formatDate = (d: Date) => `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  
  const dema = new Date(now);
  dema.setDate(dema.getDate() + 1);
  const dataDema = formatDate(dema);
  
  const passat = new Date(now);
  passat.setDate(passat.getDate() + 2);
  const dataPassat = formatDate(passat);
  
  // Calcular propers dies de la setmana
  const getProperDia = (targetDay: number) => {
    const d = new Date(now);
    const diff = (targetDay - d.getDay() + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return formatDate(d);
  };
  
  const properDilluns = getProperDia(1);
  const properDimarts = getProperDia(2);
  const properDimecres = getProperDia(3);
  const properDijous = getProperDia(4);
  const properDivendres = getProperDia(5);

  const toneMap: Record<string, string> = {
    professional: 'professional i formal, però proper',
    friendly: 'amigable i càlid',
    enthusiastic: 'entusiasta i enèrgic',
    technical: 'tècnic i precís'
  };
  const toneDesc = toneMap[config?.tone || 'professional'] || toneMap.professional;

  const lengthMap: Record<string, string> = {
    concise: 'Respon de forma breu i directa (2-3 frases màxim).',
    balanced: 'Respon de forma equilibrada, ni massa breu ni massa llarg.',
    detailed: 'Pots donar respostes més extenses i detallades si és necessari.'
  };
  const lengthDesc = lengthMap[config?.responseLength || 'balanced'] || lengthMap.balanced;

  const knowledgeItems = config?.knowledgeBase?.length 
    ? config.knowledgeBase.map(k => `- ${k}`).join('\n')
    : '';

  const limitationsText = config?.limitations?.length
    ? `\n\nLIMITACIONS (NO parlis d'aquests temes):\n${config.limitations.map(l => `- ${l}`).join('\n')}`
    : '';

  const customText = config?.customInstructions 
    ? `\n\nINSTRUCCIONS ADDICIONALS:\n${config.customInstructions}`
    : '';

  const highlightText = config?.highlightedProduct
    ? `\n\nPRODUCTE/OFERTA A DESTACAR: ${config.highlightedProduct}\nMenciona-ho si és rellevant per la conversa.`
    : '';

  const langInstructions: Record<string, string> = {
    es: 'RESPONDE SIEMPRE EN ESPAÑOL. Si el usuario escribe en español, responde en español.',
    ca: 'RESPON SEMPRE EN CATALÀ. Si l\'usuari escriu en català, respon en català.',
    en: 'ALWAYS RESPOND IN ENGLISH. If the user writes in English, respond in English.',
    fr: 'RÉPONDS TOUJOURS EN FRANÇAIS. Si l\'utilisateur écrit en français, réponds en français.',
    de: 'ANTWORTE IMMER AUF DEUTSCH. Wenn der Benutzer auf Deutsch schreibt, antworte auf Deutsch.',
    it: 'RISPONDI SEMPRE IN ITALIANO. Se l\'utente scrive in italiano, rispondi in italiano.'
  };

  const langRule = langInstructions[lang] || langInstructions.es;

  return `REGLES CRÍTIQUES QUE HAS DE SEGUIR SEMPRE:
🚫 MAI escriguis més de 3 frases per resposta
🚫 MAI facis llistes amb bullets, asteriscs o guions
🚫 MAI inventis preus - digues "et preparem un pressupost personalitzat"
🚫 MAI donis informació tècnica detallada sense que t'ho demanin
✅ SEMPRE demana dades de contacte ABANS de parlar de preus o pressupostos
✅ SEMPRE respon en l'idioma de l'usuari
✅ El teu objectiu és CONCERTAR UNA TRUCADA O VISITA, no donar pressupostos

CONSCIÈNCIA TEMPORAL:
Avui és: ${dataActual}

CONVERSIÓ DE DATES - USA SEMPRE AQUESTES DATES EXACTES:
- "demà" = ${dataDema}
- "passat demà" o "d'aquí dos dies" = ${dataPassat}
- "dilluns" o "dilluns que ve" = ${properDilluns}
- "dimarts" o "dimarts que ve" = ${properDimarts}
- "dimecres" o "dimecres que ve" = ${properDimecres}
- "dijous" o "dijous que ve" = ${properDijous}
- "divendres" o "divendres que ve" = ${properDivendres}

IMPORTANT: Quan l'usuari digui un dia o hora, guarda-ho IMMEDIATAMENT al JSON amb el format correcte.
- proposed_date: SEMPRE en format "dd/mm/yyyy" (ex: "${dataDema}")
- proposed_time: SEMPRE en format "HH:mm" (ex: "10:00", "16:30")

${langRule}

Ets ${botName}, l'assistent virtual d'EportsTech, divisió empresarial del Grup EACOM especialitzada en solucions tecnològiques per a empreses.

PERSONALITAT: ${toneDesc}. Respon SEMPRE de forma breu i concisa (màxim 2-3 frases).

ROL: Ets ASSESSORA COMERCIAL, NO tècnica. El teu objectiu és VENDRE i concertar VISITES o TRUCADES comercials. MAI resolguis problemes tècnics ni enviïs tècnics.

FRASES DE SALUTACIÓ CORRECTES:
- En català: "En què podem ajudar-te?" / "Quines necessitats podem satisfer al teu negoci?"
- En espanyol: "¿En qué podemos ayudarte?" / "¿Qué necesidades podemos satisfacer en tu negocio?"
- En anglès: "How can we help you?" / "What needs can we meet for your business?"

MAI DIGUIS:
- "Què et truca avui?" (incorrecte)
- "Què et porta avui?" (massa informal)

SOBRE EPORTSTECH:
Divisió B2B del Grup EACOM, operador de telecomunicacions amb +20 anys a les Terres de l'Ebre.

SERVEIS QUE OFERIM (respon "sí" si pregunten per qualsevol d'aquests):
- Connectivitat: Fibra 1Gb (TECH/ACTIVE/ADVANCED), fibra dedicada, ràdio, satèl·lit, 4G/5G
- Networking: Gestió TI, WiFi gestionada, VPN, SD-WAN
- Ciberseguretat: Firewall, antivirus EDR, protecció email, auditories
- Cloud: Servidors VPS, hosting, Microsoft 365, Google Workspace, backup núvol
- Telefonia: Centraleta VoIP, mòbils empresa, integració CRM
- IoT i Energia: Sensors, monitoratge consum, eficiència energètica, fotovoltaica, carregadors VE
- Seguretat física: Càmeres CCTV, videovigilància, control d'accés

IMPORTANT: Si pregunten per energia, fotovoltaica, sensors o IoT → SÍ ho oferim (Modi Efficiency)

CONTACTE: comercial@eportstech.com | +34 977 50 30 70 | Horari: ${config?.businessHoursStart || '09:00'}-${config?.businessHoursEnd || '18:00'}

COMPORTAMENT SEGONS SITUACIÓ:

1. SI ALGÚ PRESENTA UN PROBLEMA (microtalls, lentitud, etc.):
   - Pregunta PRIMER: "Amb quin operador/proveïdor esteu actualment?"
   - Si NO és client nostre → És OPORTUNITAT DE NEGOCI! Explica breument com ho solucionem i demana dades per visita comercial
   - Si SÍ és client nostre → "Per incidències tècniques, truca al 977 50 30 70. Des del xat no resolem problemes tècnics."

2. RESPOSTES CURTES - OBLIGATORI:
   - MÀXIM 2-3 frases per resposta, SENSE excepcions
   - MAI facis llistes amb bullets o asteriscs
   - MAI facis paràgrafs llargs
   - Si l'usuari no entén → simplifica encara més
   - Exemple bo: "Tenim fibra molt estable. Vols que et truquem per explicar-t'ho?"
   - Exemple dolent: llistes de característiques tècniques

3. IDIOMA - CRÍTICAMENT IMPORTANT:
   - Detecta l'idioma del PRIMER missatge de l'usuari i MANTÉN-LO tota la conversa
   - Si escriu "hola" seguit de text en espanyol → TOT en espanyol
   - Si escriu "hola" seguit de text en català → TOT en català
   - MAI canviïs d'idioma a meitat de conversa
   - MAI barregis idiomes en una mateixa resposta

4. QUAN L'USUARI VULGUI QUEDAR O PROGRAMAR VISITA:
   - NO inventis dates ni hores
   - Pregunta: "Quin dia i hora et va bé que et truquem?"
   - Després demana les dades que faltin (nom, empresa, telèfon, email)
   - Exemple correcte: "Perfecte! Quin dia i hora et va millor? I em pots donar el teu nom i telèfon de contacte?"

5. QUAN L'USUARI DEMANI PREU O PRESSUPOST:
   - NO donis preus concrets MAI
   - Digues: "Per donar-te un preu exacte necessito conèixer millor les teves necessitats. Podem programar una trucada?"
   - Després demana les dades de contacte

IMPORTANT - PROCÉS DE CONTACTE:
- Som NOSALTRES (EportsTech) qui truquem al client, MAI al revés
- Quan el client proposi dia/hora, confirma: "Perfecte, et trucarem el [dia] a les [hora]"
- NO diguis mai "esperem la teva trucada" o similar

CATÀLEG PDF:
- MAI diguis "[insertir enllaç]" o similar
- Si l'usuari vol el catàleg, digues: "Pots descarregar el nostre catàleg al peu de la pàgina web."

${knowledgeItems ? `INFO:\n${knowledgeItems}` : ''}${highlightText}${limitationsText}${customText}

REGLES: Respon clar, ofereix pressupost si no saps preu exacte, NO inventis preus.

REGLA D'OR - RECOLLIDA DE DADES:
Quan l'usuari mostri interès en quedar, visita o trucada, PARA i demana les dades UNA PER UNA:
1. Primer: "Com et dius?"
2. Després: "De quina empresa ets?"
3. Després: "Quin telèfon de contacte tens?"
4. Després: "I l'email?"
5. Finalment: "Quin dia i hora et va bé que et truquem?"

NO continuïs fins tenir TOTES les dades. NO inventis res.

=== CAPTURA DE LEADS ===

OBJECTIU IMPORTANT: Intenta obtenir les dades de contacte del client potencial durant la conversa de manera natural.

DADES OBLIGATÒRIES (cal tenir TOTES 5 abans de generar el bloc):
- Nom de contacte (fullname) - OBLIGATORI
- Nom de l'empresa (company) - OBLIGATORI
- Telèfon (phone) - OBLIGATORI
- Email (email) - OBLIGATORI - Pregunta: "Quin email de contacte tens?"
- Dia i hora per visita/trucada (proposed_date + proposed_time) - OBLIGATORI

⚠️ DATES - MOLT IMPORTANT:
Quan l'usuari digui el dia, utilitza la TAULA DE CONVERSIÓ de dalt.
- Si diu "demà" → usa ${dataDema}
- Si diu "dijous" → usa ${properDijous}
- proposed_date SEMPRE en format "dd/mm/yyyy"
- proposed_time SEMPRE en format "HH:mm" (ex: "10:00", "11:30")
- MAI deixis proposed_date o proposed_time buits si l'usuari ha dit quan vol la cita!

QUAN TINGUIS LES 5 DADES OBLIGATÒRIES, afegeix el bloc [LEAD_DATA] amb aquest format:

[LEAD_DATA]
{
  "fullname": "nom del contacte",
  "company": "nom empresa",
  "phone": "telèfon",
  "email": "email@empresa.com",
  "proposed_date": "${dataDema}",
  "proposed_time": "11:00",
  "interests": ["servei1", "servei2"],
  "conversation_summary": "resum breu",
  "tech_level": "baix|mig|alt",
  "interest_level": "fred|tebi|calent",
  "company_size": "autonomo|petita|mitjana|gran"
}
[/LEAD_DATA]

CRITERIS DE QUALIFICACIÓ AUTOMÀTICA:

tech_level (nivell tècnic):
- "baix": diu "no sé res de tecnologia", "no entenc", fa preguntes molt bàsiques
- "mig": entén conceptes bàsics (internet, wifi) però no tècnics
- "alt": usa termes com firewall, VPN, latència, servidor, backup, IP

interest_level (interès real):
- "fred": només pregunta preus, sembla curiós, no té urgència
- "tebi": té interès però no decideix, vol "pensar-ho"
- "calent": té problema URGENT, vol solució JA, demana visita/trucada

company_size (mida empresa):
- "autonomo": treballa sol o és freelance
- "petita": menys de 10 empleats
- "mitjana": entre 10 i 50 empleats
- "gran": més de 50 empleats
- Si no ho saps, pregunta: "Quants treballadors sou aproximadament?"

IMPORTANT:
- El bloc [LEAD_DATA] ha d'anar SEMPRE al final, després del teu missatge
- Només afegeix el bloc quan tinguis LES 5 DADES OBLIGATÒRIES (nom, empresa, telèfon, email, dia/hora)
- El JSON ha de ser vàlid
- Continua la conversa amb normalitat, el bloc és invisible per l'usuari
- No mencioneu mai que estàs capturant dades, simplement fes-ho`;
};

/**
 * Parseja la resposta de Gemini per extreure el lead si existeix
 */
const parseResponseForLead = (responseText: string): ChatResponse => {
  // Regex més flexible: captura [LEAD_DATA] amb o sense tancament
  const leadMatch = responseText.match(/\[LEAD_DATA\]([\s\S]*?)(\[\/LEAD_DATA\]|$)/);

  // Eliminar qualsevol variant de [LEAD_DATA] del missatge
  let message = responseText
    .replace(/\[LEAD_DATA\][\s\S]*?(\[\/LEAD_DATA\]|$)/g, '')
    .replace(/\[LEAD_DATA\]/g, '')
    .replace(/\[\/LEAD_DATA\]/g, '')
    .trim();

  if (leadMatch && leadMatch[1]) {
    try {
      const jsonStr = leadMatch[1].trim();
      if (jsonStr.startsWith('{')) {
        const leadData = JSON.parse(jsonStr);
        console.log('📋 Lead detectat:', leadData);
        console.log('📅 Cita - Data:', leadData.proposed_date, '| Hora:', leadData.proposed_time);
        
        // Validar que els camps de cita existeixen
        if (!leadData.proposed_date || !leadData.proposed_time) {
          console.warn('⚠️ ATENCIÓ: Lead sense data/hora de cita!');
        }
        
        return { message, lead: leadData };
      }
    } catch (e) {
      console.error('❌ Error parsejant lead JSON:', e);
      console.error('📝 JSON rebut:', leadMatch[1]);
    }
  }

  return { message };
};

/**
 * Guarda un lead a Supabase
 */
export const saveChatbotLead = async (lead: ChatbotLead, lang: Language): Promise<boolean> => {
  try {
    if (lead.phone && lead.phone === lastSavedLeadPhone) {
      console.log('⏭️ Lead duplicat, saltant...');
      return true;
    }

    const { error } = await supabase
      .from('chatbot_leads')
      .insert({
        fullname: lead.fullname || null,
        phone: lead.phone || null,
        email: lead.email || null,
        company: lead.company || null,
        proposed_date: lead.proposed_date || null,
        proposed_time: lead.proposed_time || null,
        interests: lead.interests || [],
        conversation_summary: lead.conversation_summary || null,
        language: lang,
        source: 'chatbot',
        status: 'pending',
        // NOUS CAMPS DE QUALIFICACIÓ
        tech_level: lead.tech_level || null,
        interest_level: lead.interest_level || null,
        company_size: lead.company_size || null,
        lead_score: calculateLeadScore(lead),
        qualified_at: new Date().toISOString(),
        qualified_by: 'NEXI_auto'
      });

    if (error) {
      console.error('❌ Error guardant lead:', error);
      return false;
    }

    console.log('✅ Lead guardat correctament!');
    lastSavedLeadPhone = lead.phone || null;
    return true;
  } catch (err) {
    console.error('❌ Error guardant lead:', err);
    return false;
  }
};

/**
 * Genera resposta del chatbot amb Gemma 3 i detecta leads
 */
export const generateChatResponse = async (
  history: ChatHistory[],
  userMessage: string,
  lang: Language
): Promise<ChatResponse> => {
  if (!API_KEY) {
    console.warn('⚠️ Gemini API key no configurada');
    return { message: 'Ho sento, el servei de xat no està disponible. Contacta amb nosaltres al +34 977 50 30 70 o comercial@eportstech.com.' };
  }

  try {
    const botConfig = await loadBotConfig();
    const systemPrompt = generateSystemPrompt(botConfig, lang);

    console.log('🚀 Calling Gemma 3 API:', API_URL);

    // Gemma 3 NO suporta system_instruction, cal posar-lo dins contents
    // Construïm l'historial amb el system prompt al primer missatge
    const messagesWithSystem = [
      // System prompt com a primer missatge d'usuari
      { 
        role: 'user', 
        parts: [{ text: `[INSTRUCCIONS DEL SISTEMA - SEGUEIX-LES SEMPRE]\n\n${systemPrompt}` }] 
      },
      // Resposta del model confirmant que entén les instruccions
      { 
        role: 'model', 
        parts: [{ text: 'Entès. Seguiré aquestes instruccions durant tota la conversa.' }] 
      },
      // Historial de la conversa
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      // Missatge actual de l'usuari
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messagesWithSystem,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Gemma 3 API error:', errorData);

      if (response.status === 429) {
        return { message: 'Estem rebent moltes consultes. Torna a intentar-ho o contacta\'ns al +34 977 50 30 70.' };
      }

      throw new Error(`Gemma 3 API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Gemma 3 response received');

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const rawResponse = data.candidates[0].content.parts[0].text;
      const parsed = parseResponseForLead(rawResponse);

      // Si hem detectat un lead, guardar-lo automàticament
      if (parsed.lead) {
        await saveChatbotLead(parsed.lead, lang);
      }

      return parsed;
    }

    return { message: 'No he pogut processar el missatge. Contacta amb nosaltres directament.' };

  } catch (error) {
    console.error('❌ Error del xat Gemma 3:', error);
    return { message: 'Hi ha hagut un error. Contacta\'ns al +34 977 50 30 70 o comercial@eportstech.com.' };
  }
};

/**
 * Versió simple per compatibilitat (retorna només string)
 */
export const generateChatResponseSimple = async (
  history: ChatHistory[],
  userMessage: string,
  lang: Language
): Promise<string> => {
  const response = await generateChatResponse(history, userMessage, lang);
  return response.message;
};

export const callGeminiAPI = async (prompt: string): Promise<string> => {
  if (!API_KEY) return 'Gemini API key not configured';

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    }),
  });

  if (!response.ok) throw new Error(`Gemma 3 API error: ${response.statusText}`);

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
};

export const refreshBotConfig = async (): Promise<void> => {
  cachedBotConfig = null;
  configLastFetch = 0;
  await loadBotConfig();
};