import React, { useState } from 'react';
import { Language } from '../types';
import { 
  Lightbulb, 
  Shield, 
  Wifi, 
  Phone, 
  Cloud, 
  Cpu, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Sparkles,
  RotateCcw,
  ChevronDown
} from 'lucide-react';

interface NeedsAssessmentProps {
  lang: Language;
  onRecommendations?: (recommendations: Recommendation[]) => void;
}

interface Priority {
  id: string;
  icon: React.ElementType;
  label: Record<Language, string>;
  description: Record<Language, string>;
}

interface Recommendation {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  level: 'essential' | 'recommended' | 'optional';
  icon: React.ElementType;
  priority: string;
}

// Prioritats disponibles
const PRIORITIES: Priority[] = [
  {
    id: 'connectivity',
    icon: Wifi,
    label: {
      es: 'Conectividad',
      ca: 'Connectivitat',
      en: 'Connectivity',
      fr: 'Connectivité',
      de: 'Konnektivität',
      it: 'Connettività'
    },
    description: {
      es: 'Internet rápido y fiable para mi negocio',
      ca: 'Internet ràpid i fiable pel meu negoci',
      en: 'Fast and reliable internet for my business',
      fr: 'Internet rapide et fiable pour mon entreprise',
      de: 'Schnelles und zuverlässiges Internet für mein Unternehmen',
      it: 'Internet veloce e affidabile per la mia azienda'
    }
  },
  {
    id: 'security',
    icon: Shield,
    label: {
      es: 'Ciberseguridad',
      ca: 'Ciberseguretat',
      en: 'Cybersecurity',
      fr: 'Cybersécurité',
      de: 'Cybersicherheit',
      it: 'Sicurezza informatica'
    },
    description: {
      es: 'Proteger mi empresa de amenazas y ataques',
      ca: 'Protegir la meva empresa d\'amenaces i atacs',
      en: 'Protect my business from threats and attacks',
      fr: 'Protéger mon entreprise contre les menaces',
      de: 'Mein Unternehmen vor Bedrohungen schützen',
      it: 'Proteggere la mia azienda dalle minacce'
    }
  },
  {
    id: 'telephony',
    icon: Phone,
    label: {
      es: 'Telefonía',
      ca: 'Telefonia',
      en: 'Telephony',
      fr: 'Téléphonie',
      de: 'Telefonie',
      it: 'Telefonia'
    },
    description: {
      es: 'Comunicaciones profesionales y centralita',
      ca: 'Comunicacions professionals i centraleta',
      en: 'Professional communications and PBX',
      fr: 'Communications professionnelles et standard',
      de: 'Professionelle Kommunikation und Telefonanlage',
      it: 'Comunicazioni professionali e centralino'
    }
  },
  {
    id: 'cloud',
    icon: Cloud,
    label: {
      es: 'Nube y Backup',
      ca: 'Núvol i Backup',
      en: 'Cloud & Backup',
      fr: 'Cloud et Sauvegarde',
      de: 'Cloud & Backup',
      it: 'Cloud e Backup'
    },
    description: {
      es: 'Almacenamiento seguro y acceso remoto',
      ca: 'Emmagatzematge segur i accés remot',
      en: 'Secure storage and remote access',
      fr: 'Stockage sécurisé et accès à distance',
      de: 'Sichere Speicherung und Fernzugriff',
      it: 'Archiviazione sicura e accesso remoto'
    }
  },
  {
    id: 'infrastructure',
    icon: Cpu,
    label: {
      es: 'Infraestructura IT',
      ca: 'Infraestructura IT',
      en: 'IT Infrastructure',
      fr: 'Infrastructure IT',
      de: 'IT-Infrastruktur',
      it: 'Infrastruttura IT'
    },
    description: {
      es: 'Redes, servidores y equipamiento',
      ca: 'Xarxes, servidors i equipament',
      en: 'Networks, servers and equipment',
      fr: 'Réseaux, serveurs et équipement',
      de: 'Netzwerke, Server und Ausrüstung',
      it: 'Reti, server e attrezzature'
    }
  }
];

// Recomanacions basades en prioritats
const RECOMMENDATIONS_MAP: Record<string, Recommendation[]> = {
  connectivity: [
    {
      id: 'fiber',
      title: { es: 'Fibra Óptica Empresarial', ca: 'Fibra Òptica Empresarial', en: 'Business Fiber Optic', fr: 'Fibre Optique Pro', de: 'Business Glasfaser', it: 'Fibra Ottica Business' },
      description: { es: 'Conexión simétrica de alta velocidad', ca: 'Connexió simètrica d\'alta velocitat', en: 'High-speed symmetric connection', fr: 'Connexion symétrique haute vitesse', de: 'Symmetrische Hochgeschwindigkeitsverbindung', it: 'Connessione simmetrica ad alta velocità' },
      level: 'essential',
      icon: Wifi,
      priority: 'connectivity'
    },
    {
      id: 'backup-4g',
      title: { es: 'Backup 4G/5G', ca: 'Backup 4G/5G', en: '4G/5G Backup', fr: 'Backup 4G/5G', de: '4G/5G Backup', it: 'Backup 4G/5G' },
      description: { es: 'Conexión de respaldo automática', ca: 'Connexió de respatller automàtica', en: 'Automatic backup connection', fr: 'Connexion de secours automatique', de: 'Automatische Backup-Verbindung', it: 'Connessione di backup automatica' },
      level: 'recommended',
      icon: Wifi,
      priority: 'connectivity'
    },
    {
      id: 'sdwan',
      title: { es: 'SD-WAN', ca: 'SD-WAN', en: 'SD-WAN', fr: 'SD-WAN', de: 'SD-WAN', it: 'SD-WAN' },
      description: { es: 'Red inteligente multi-sede', ca: 'Xarxa intel·ligent multi-seu', en: 'Intelligent multi-site network', fr: 'Réseau intelligent multi-sites', de: 'Intelligentes Multi-Standort-Netzwerk', it: 'Rete intelligente multi-sede' },
      level: 'optional',
      icon: Cpu,
      priority: 'connectivity'
    }
  ],
  security: [
    {
      id: 'firewall',
      title: { es: 'Firewall Avanzado', ca: 'Firewall Avançat', en: 'Advanced Firewall', fr: 'Firewall Avancé', de: 'Erweiterte Firewall', it: 'Firewall Avanzato' },
      description: { es: 'Protección perimetral de nueva generación', ca: 'Protecció perimetral de nova generació', en: 'Next-gen perimeter protection', fr: 'Protection périmétrique nouvelle génération', de: 'Perimeterschutz der nächsten Generation', it: 'Protezione perimetrale di nuova generazione' },
      level: 'essential',
      icon: Shield,
      priority: 'security'
    },
    {
      id: 'edr',
      title: { es: 'EDR / Antivirus', ca: 'EDR / Antivirus', en: 'EDR / Antivirus', fr: 'EDR / Antivirus', de: 'EDR / Antivirus', it: 'EDR / Antivirus' },
      description: { es: 'Protección de endpoints', ca: 'Protecció d\'endpoints', en: 'Endpoint protection', fr: 'Protection des terminaux', de: 'Endpoint-Schutz', it: 'Protezione degli endpoint' },
      level: 'essential',
      icon: Shield,
      priority: 'security'
    },
    {
      id: 'security-audit',
      title: { es: 'Auditoría de Seguridad', ca: 'Auditoria de Seguretat', en: 'Security Audit', fr: 'Audit de Sécurité', de: 'Sicherheitsaudit', it: 'Audit di Sicurezza' },
      description: { es: 'Análisis de vulnerabilidades', ca: 'Anàlisi de vulnerabilitats', en: 'Vulnerability assessment', fr: 'Analyse des vulnérabilités', de: 'Schwachstellenanalyse', it: 'Analisi delle vulnerabilità' },
      level: 'recommended',
      icon: Shield,
      priority: 'security'
    },
    {
      id: 'security-training',
      title: { es: 'Formación en Seguridad', ca: 'Formació en Seguretat', en: 'Security Training', fr: 'Formation Sécurité', de: 'Sicherheitsschulung', it: 'Formazione Sicurezza' },
      description: { es: 'Concienciación para empleados', ca: 'Conscienciació per empleats', en: 'Employee awareness', fr: 'Sensibilisation des employés', de: 'Mitarbeitersensibilisierung', it: 'Sensibilizzazione dipendenti' },
      level: 'recommended',
      icon: Shield,
      priority: 'security'
    }
  ],
  telephony: [
    {
      id: 'voip',
      title: { es: 'Telefonía VoIP', ca: 'Telefonia VoIP', en: 'VoIP Telephony', fr: 'Téléphonie VoIP', de: 'VoIP-Telefonie', it: 'Telefonia VoIP' },
      description: { es: 'Centralita virtual en la nube', ca: 'Centraleta virtual al núvol', en: 'Cloud virtual PBX', fr: 'Standard virtuel cloud', de: 'Cloud-Telefonanlage', it: 'Centralino virtuale cloud' },
      level: 'essential',
      icon: Phone,
      priority: 'telephony'
    },
    {
      id: 'crm-integration',
      title: { es: 'Integración CRM', ca: 'Integració CRM', en: 'CRM Integration', fr: 'Intégration CRM', de: 'CRM-Integration', it: 'Integrazione CRM' },
      description: { es: 'Conecta teléfono con tu CRM', ca: 'Connecta telèfon amb el teu CRM', en: 'Connect phone with your CRM', fr: 'Connectez téléphone et CRM', de: 'Telefon mit CRM verbinden', it: 'Collega telefono e CRM' },
      level: 'recommended',
      icon: Phone,
      priority: 'telephony'
    },
    {
      id: 'contact-center',
      title: { es: 'Contact Center', ca: 'Contact Center', en: 'Contact Center', fr: 'Centre de Contact', de: 'Contact Center', it: 'Contact Center' },
      description: { es: 'Gestión avanzada de llamadas', ca: 'Gestió avançada de trucades', en: 'Advanced call management', fr: 'Gestion avancée des appels', de: 'Erweiterte Anrufverwaltung', it: 'Gestione avanzata chiamate' },
      level: 'optional',
      icon: Phone,
      priority: 'telephony'
    }
  ],
  cloud: [
    {
      id: 'cloud-backup',
      title: { es: 'Backup en la Nube', ca: 'Backup al Núvol', en: 'Cloud Backup', fr: 'Sauvegarde Cloud', de: 'Cloud-Backup', it: 'Backup Cloud' },
      description: { es: 'Copias de seguridad automáticas', ca: 'Còpies de seguretat automàtiques', en: 'Automatic backups', fr: 'Sauvegardes automatiques', de: 'Automatische Backups', it: 'Backup automatici' },
      level: 'essential',
      icon: Cloud,
      priority: 'cloud'
    },
    {
      id: 'microsoft365',
      title: { es: 'Microsoft 365', ca: 'Microsoft 365', en: 'Microsoft 365', fr: 'Microsoft 365', de: 'Microsoft 365', it: 'Microsoft 365' },
      description: { es: 'Email y herramientas colaborativas', ca: 'Email i eines col·laboratives', en: 'Email and collaborative tools', fr: 'Email et outils collaboratifs', de: 'E-Mail und Kollaborationstools', it: 'Email e strumenti collaborativi' },
      level: 'recommended',
      icon: Cloud,
      priority: 'cloud'
    },
    {
      id: 'cloud-migration',
      title: { es: 'Migración a la Nube', ca: 'Migració al Núvol', en: 'Cloud Migration', fr: 'Migration Cloud', de: 'Cloud-Migration', it: 'Migrazione Cloud' },
      description: { es: 'Traslado de sistemas al cloud', ca: 'Trasllat de sistemes al cloud', en: 'Move systems to cloud', fr: 'Transfert vers le cloud', de: 'Systeme in die Cloud migrieren', it: 'Spostamento sistemi nel cloud' },
      level: 'optional',
      icon: Cloud,
      priority: 'cloud'
    }
  ],
  infrastructure: [
    {
      id: 'managed-wifi',
      title: { es: 'WiFi Gestionado', ca: 'WiFi Gestionat', en: 'Managed WiFi', fr: 'WiFi Géré', de: 'Managed WiFi', it: 'WiFi Gestito' },
      description: { es: 'Red inalámbrica profesional', ca: 'Xarxa sense fils professional', en: 'Professional wireless network', fr: 'Réseau sans fil professionnel', de: 'Professionelles WLAN', it: 'Rete wireless professionale' },
      level: 'essential',
      icon: Wifi,
      priority: 'infrastructure'
    },
    {
      id: 'networking',
      title: { es: 'Networking', ca: 'Networking', en: 'Networking', fr: 'Réseau', de: 'Netzwerk', it: 'Networking' },
      description: { es: 'Switches, routers y cableado', ca: 'Switches, routers i cablejat', en: 'Switches, routers and cabling', fr: 'Switches, routeurs et câblage', de: 'Switches, Router und Verkabelung', it: 'Switch, router e cablaggio' },
      level: 'essential',
      icon: Cpu,
      priority: 'infrastructure'
    },
    {
      id: 'vpn',
      title: { es: 'VPN Empresarial', ca: 'VPN Empresarial', en: 'Business VPN', fr: 'VPN Entreprise', de: 'Business VPN', it: 'VPN Aziendale' },
      description: { es: 'Acceso remoto seguro', ca: 'Accés remot segur', en: 'Secure remote access', fr: 'Accès distant sécurisé', de: 'Sicherer Fernzugriff', it: 'Accesso remoto sicuro' },
      level: 'recommended',
      icon: Shield,
      priority: 'infrastructure'
    }
  ]
};

// Traduccions
const TEXTS = {
  sectionTag: {
    es: 'Asesor Virtual',
    ca: 'Assessor Virtual',
    en: 'Virtual Advisor',
    fr: 'Conseiller Virtuel',
    de: 'Virtueller Berater',
    it: 'Consulente Virtuale'
  },
  title: {
    es: 'Te ayudamos a identificar tus necesidades',
    ca: 'T\'ajudem a identificar les teves necessitats',
    en: 'We help you identify your needs',
    fr: 'Nous vous aidons à identifier vos besoins',
    de: 'Wir helfen Ihnen, Ihre Bedürfnisse zu ermitteln',
    it: 'Ti aiutiamo a identificare le tue esigenze'
  },
  subtitle: {
    es: 'Selecciona tus prioridades y te recomendaremos las soluciones más adecuadas para tu empresa',
    ca: 'Selecciona les teves prioritats i et recomanarem les solucions més adequades per a la teva empresa',
    en: 'Select your priorities and we\'ll recommend the most suitable solutions for your business',
    fr: 'Sélectionnez vos priorités et nous vous recommanderons les solutions les plus adaptées',
    de: 'Wählen Sie Ihre Prioritäten und wir empfehlen Ihnen die passendsten Lösungen',
    it: 'Seleziona le tue priorità e ti consiglieremo le soluzioni più adatte'
  },
  step1Title: {
    es: '¿Cuáles son tus principales prioridades?',
    ca: 'Quines són les teves principals prioritats?',
    en: 'What are your main priorities?',
    fr: 'Quelles sont vos principales priorités?',
    de: 'Was sind Ihre wichtigsten Prioritäten?',
    it: 'Quali sono le tue principali priorità?'
  },
  step1Subtitle: {
    es: 'Puedes seleccionar varias opciones',
    ca: 'Pots seleccionar diverses opcions',
    en: 'You can select multiple options',
    fr: 'Vous pouvez sélectionner plusieurs options',
    de: 'Sie können mehrere Optionen auswählen',
    it: 'Puoi selezionare più opzioni'
  },
  seeRecommendations: {
    es: 'Ver recomendaciones',
    ca: 'Veure recomanacions',
    en: 'See recommendations',
    fr: 'Voir les recommandations',
    de: 'Empfehlungen anzeigen',
    it: 'Vedi consigli'
  },
  recommendations: {
    es: 'Nuestras recomendaciones para ti',
    ca: 'Les nostres recomanacions per a tu',
    en: 'Our recommendations for you',
    fr: 'Nos recommandations pour vous',
    de: 'Unsere Empfehlungen für Sie',
    it: 'I nostri consigli per te'
  },
  essential: {
    es: 'Esencial',
    ca: 'Essencial',
    en: 'Essential',
    fr: 'Essentiel',
    de: 'Wesentlich',
    it: 'Essenziale'
  },
  recommended: {
    es: 'Recomendado',
    ca: 'Recomanat',
    en: 'Recommended',
    fr: 'Recommandé',
    de: 'Empfohlen',
    it: 'Consigliato'
  },
  optional: {
    es: 'Opcional',
    ca: 'Opcional',
    en: 'Optional',
    fr: 'Optionnel',
    de: 'Optional',
    it: 'Opzionale'
  },
  restart: {
    es: 'Empezar de nuevo',
    ca: 'Començar de nou',
    en: 'Start over',
    fr: 'Recommencer',
    de: 'Neu starten',
    it: 'Ricomincia'
  },
  requestQuote: {
    es: 'Solicitar presupuesto',
    ca: 'Sol·licitar pressupost',
    en: 'Request quote',
    fr: 'Demander un devis',
    de: 'Angebot anfordern',
    it: 'Richiedi preventivo'
  },
  selectedServices: {
    es: 'servicios seleccionados',
    ca: 'serveis seleccionats',
    en: 'services selected',
    fr: 'services sélectionnés',
    de: 'Dienste ausgewählt',
    it: 'servizi selezionati'
  },
  selectPriority: {
    es: 'Selecciona al menos una prioridad',
    ca: 'Selecciona almenys una prioritat',
    en: 'Select at least one priority',
    fr: 'Sélectionnez au moins une priorité',
    de: 'Wählen Sie mindestens eine Priorität',
    it: 'Seleziona almeno una priorità'
  }
};

const NeedsAssessment: React.FC<NeedsAssessmentProps> = ({ lang, onRecommendations }) => {
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  const togglePriority = (id: string) => {
    setSelectedPriorities(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const getRecommendations = (): Recommendation[] => {
    const allRecs: Recommendation[] = [];
    selectedPriorities.forEach(priority => {
      const recs = RECOMMENDATIONS_MAP[priority] || [];
      recs.forEach(rec => {
        if (!allRecs.find(r => r.id === rec.id)) {
          allRecs.push(rec);
        }
      });
    });
    // Ordenar per nivell
    const order = { essential: 0, recommended: 1, optional: 2 };
    return allRecs.sort((a, b) => order[a.level] - order[b.level]);
  };

  const toggleRecommendation = (id: string) => {
    setSelectedRecommendations(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleSeeRecommendations = () => {
    if (selectedPriorities.length > 0) {
      setShowRecommendations(true);
      // Pre-seleccionar els essencials
      const essentials = getRecommendations()
        .filter(r => r.level === 'essential')
        .map(r => r.id);
      setSelectedRecommendations(essentials);
    }
  };

  const handleRestart = () => {
    setSelectedPriorities([]);
    setShowRecommendations(false);
    setSelectedRecommendations([]);
  };

  const handleRequestQuote = () => {
    const selected = getRecommendations().filter(r => selectedRecommendations.includes(r.id));
    
    // Primer passar les recomanacions al parent
    if (onRecommendations) {
      onRecommendations(selected);
    }
    
    // Després fer scroll al formulari (amb petit delay per assegurar que s'actualitza l'estat)
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const recommendations = getRecommendations();
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'essential': return 'bg-red-100 text-red-700 border-red-200';
      case 'recommended': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'optional': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-primary-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Lightbulb size={16} />
            <span>{TEXTS.sectionTag[lang]}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {TEXTS.title[lang]}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {TEXTS.subtitle[lang]}
          </p>
        </div>

        {/* Contingut col·lapsable */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Toggle header */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <Sparkles size={18} className="text-primary-600" />
              {showRecommendations ? TEXTS.recommendations[lang] : TEXTS.step1Title[lang]}
            </span>
            <ChevronDown 
              size={20} 
              className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </button>

          {isExpanded && (
            <div className="p-6 md:p-8">
              {!showRecommendations ? (
                /* STEP 1: Selecció de prioritats */
                <div>
                  <p className="text-sm text-gray-500 mb-6 text-center">
                    {TEXTS.step1Subtitle[lang]}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {PRIORITIES.map(priority => {
                      const Icon = priority.icon;
                      const isSelected = selectedPriorities.includes(priority.id);
                      return (
                        <button
                          key={priority.id}
                          onClick={() => togglePriority(priority.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected 
                              ? 'border-primary-500 bg-primary-50 shadow-md' 
                              : 'border-gray-200 hover:border-primary-300 hover:shadow'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                              <Icon size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-gray-900">{priority.label[lang]}</span>
                                {isSelected && <Check size={16} className="text-primary-600" />}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{priority.description[lang]}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleSeeRecommendations}
                      disabled={selectedPriorities.length === 0}
                      className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                        selectedPriorities.length > 0
                          ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {TEXTS.seeRecommendations[lang]}
                      <ArrowRight size={18} />
                    </button>
                    {selectedPriorities.length === 0 && (
                      <p className="text-sm text-gray-400 mt-3">{TEXTS.selectPriority[lang]}</p>
                    )}
                  </div>
                </div>
              ) : (
                /* STEP 2: Recomanacions */
                <div>
                  <div className="flex flex-wrap gap-2 mb-6 justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor('essential')}`}>
                      ● {TEXTS.essential[lang]}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor('recommended')}`}>
                      ● {TEXTS.recommended[lang]}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor('optional')}`}>
                      ● {TEXTS.optional[lang]}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {recommendations.map(rec => {
                      const Icon = rec.icon;
                      const isSelected = selectedRecommendations.includes(rec.id);
                      return (
                        <button
                          key={rec.id}
                          onClick={() => toggleRecommendation(rec.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected 
                              ? 'border-primary-500 bg-primary-50 shadow-md' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${isSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                              <Icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-gray-900">{rec.title[lang]}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(rec.level)}`}>
                                  {TEXTS[rec.level][lang]}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{rec.description[lang]}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'border-primary-600 bg-primary-600' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={handleRestart}
                      className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                    >
                      <RotateCcw size={16} />
                      {TEXTS.restart[lang]}
                    </button>
                    <button
                      onClick={handleRequestQuote}
                      disabled={selectedRecommendations.length === 0}
                      className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                        selectedRecommendations.length > 0
                          ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {TEXTS.requestQuote[lang]}
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                        {selectedRecommendations.length}
                      </span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NeedsAssessment;
