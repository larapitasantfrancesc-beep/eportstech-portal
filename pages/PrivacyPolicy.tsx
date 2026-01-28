import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Loader2 } from 'lucide-react';
import { Language } from '../types';
import { getLegalText, LegalText } from '../services/supabaseMock';

interface PrivacyPolicyProps {
  lang: Language;
}

// Contingut per defecte (el que ja teníeu)
const DEFAULT_CONTENT: Record<Language, string> = {
  es: `<h2>1. Responsable del Tratamiento</h2>
<p>E-PORTS AMPLE DE BANDA I INTERNET, S.L. (en adelante, "EportsTech"), con CIF B55688410 y domicilio social en Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona (España), es el responsable del tratamiento de los datos personales recogidos a través de este sitio web.</p>
<p>Puede contactar con nosotros en:</p>
<ul>
<li>Email: hola@eportsinternet.com</li>
<li>Teléfono: 977 353 735</li>
</ul>

<h2>2. Datos que Recopilamos</h2>
<p>Recopilamos los datos personales que usted nos proporciona voluntariamente a través de nuestros formularios de contacto: nombre completo, dirección de correo electrónico, número de teléfono, nombre de la empresa y mensaje. También recopilamos automáticamente datos de navegación mediante cookies (ver Política de Cookies).</p>

<h2>3. Finalidad del Tratamiento</h2>
<p>Utilizamos sus datos para: (a) responder a sus consultas y solicitudes de información, (b) enviarle presupuestos y propuestas comerciales solicitadas, (c) gestionar la relación comercial si se convierte en cliente, (d) enviarle comunicaciones comerciales si ha dado su consentimiento expreso.</p>

<h2>4. Base Legal</h2>
<p>El tratamiento de sus datos se basa en: (a) su consentimiento al enviar el formulario de contacto, (b) la ejecución de un contrato o medidas precontractuales, (c) nuestro interés legítimo en atender sus consultas y mejorar nuestros servicios.</p>

<h2>5. Conservación de Datos</h2>
<p>Conservaremos sus datos personales mientras exista una relación comercial y, posteriormente, durante los plazos legalmente establecidos. Los datos de contacto de leads se conservan durante un máximo de 2 años si no se establece relación comercial.</p>

<h2>6. Derechos del Usuario</h2>
<p>Puede ejercer sus derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición enviando un email a hola@eportsinternet.com junto con una copia de su DNI. También tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).</p>

<h2>7. Seguridad</h2>
<p>Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso no autorizado, la pérdida o la destrucción. Utilizamos cifrado SSL/TLS en todas las comunicaciones y almacenamos los datos en servidores seguros.</p>

<h2>8. Transferencias Internacionales</h2>
<p>Sus datos pueden ser transferidos a proveedores de servicios ubicados fuera del Espacio Económico Europeo. En estos casos, garantizamos que existen las salvaguardias adecuadas conforme al RGPD.</p>`,

  ca: `<h2>1. Responsable del Tractament</h2>
<p>E-PORTS AMPLE DE BANDA I INTERNET, S.L. (en endavant, "EportsTech"), amb CIF B55688410 i domicili social a Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona (Espanya), és el responsable del tractament de les dades personals recollides a través d'aquest lloc web.</p>
<p>Pot contactar amb nosaltres a:</p>
<ul>
<li>Email: hola@eportsinternet.com</li>
<li>Telèfon: 977 353 735</li>
</ul>

<h2>2. Dades que Recopilem</h2>
<p>Recopilem les dades personals que vostè ens proporciona voluntàriament a través dels nostres formularis de contacte: nom complet, adreça de correu electrònic, número de telèfon, nom de l'empresa i missatge. També recopilem automàticament dades de navegació mitjançant cookies (veure Política de Cookies).</p>

<h2>3. Finalitat del Tractament</h2>
<p>Utilitzem les seves dades per: (a) respondre a les seves consultes i sol·licituds d'informació, (b) enviar-li pressupostos i propostes comercials sol·licitades, (c) gestionar la relació comercial si es converteix en client, (d) enviar-li comunicacions comercials si ha donat el seu consentiment exprés.</p>

<h2>4. Base Legal</h2>
<p>El tractament de les seves dades es basa en: (a) el seu consentiment en enviar el formulari de contacte, (b) l'execució d'un contracte o mesures precontractuals, (c) el nostre interès legítim en atendre les seves consultes i millorar els nostres serveis.</p>

<h2>5. Conservació de Dades</h2>
<p>Conservarem les seves dades personals mentre existeixi una relació comercial i, posteriorment, durant els terminis legalment establerts. Les dades de contacte de leads es conserven durant un màxim de 2 anys si no s'estableix relació comercial.</p>

<h2>6. Drets de l'Usuari</h2>
<p>Pot exercir els seus drets d'accés, rectificació, supressió, limitació, portabilitat i oposició enviant un email a hola@eportsinternet.com juntament amb una còpia del seu DNI. També té dret a presentar una reclamació davant l'Agència Espanyola de Protecció de Dades (AEPD).</p>

<h2>7. Seguretat</h2>
<p>Implementem mesures tècniques i organitzatives apropiades per protegir les seves dades personals contra l'accés no autoritzat, la pèrdua o la destrucció. Utilitzem xifrat SSL/TLS en totes les comunicacions i emmagatzemem les dades en servidors segurs.</p>

<h2>8. Transferències Internacionals</h2>
<p>Les seves dades poden ser transferides a proveïdors de serveis ubicats fora de l'Espai Econòmic Europeu. En aquests casos, garantim que existeixen les salvaguardes adequades conforme al RGPD.</p>`,

  en: `<h2>1. Data Controller</h2>
<p>E-PORTS AMPLE DE BANDA I INTERNET, S.L. (hereinafter, "EportsTech"), with Tax ID B55688410 and registered office at Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona (Spain), is the data controller for personal data collected through this website.</p>
<p>You can contact us at:</p>
<ul>
<li>Email: hola@eportsinternet.com</li>
<li>Phone: +34 977 353 735</li>
</ul>

<h2>2. Data We Collect</h2>
<p>We collect personal data that you voluntarily provide through our contact forms: full name, email address, phone number, company name, and message. We also automatically collect browsing data through cookies (see Cookies Policy).</p>

<h2>3. Purpose of Processing</h2>
<p>We use your data to: (a) respond to your inquiries and information requests, (b) send you requested quotes and commercial proposals, (c) manage the commercial relationship if you become a customer, (d) send you commercial communications if you have given your express consent.</p>

<h2>4. Legal Basis</h2>
<p>The processing of your data is based on: (a) your consent when submitting the contact form, (b) the execution of a contract or pre-contractual measures, (c) our legitimate interest in attending to your inquiries and improving our services.</p>

<h2>5. Data Retention</h2>
<p>We will retain your personal data as long as a commercial relationship exists and, subsequently, for the legally established periods. Lead contact data is retained for a maximum of 2 years if no commercial relationship is established.</p>

<h2>6. User Rights</h2>
<p>You can exercise your rights of access, rectification, erasure, restriction, portability, and objection by sending an email to hola@eportsinternet.com along with a copy of your ID. You also have the right to file a complaint with the Spanish Data Protection Agency (AEPD).</p>

<h2>7. Security</h2>
<p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or destruction. We use SSL/TLS encryption in all communications and store data on secure servers.</p>

<h2>8. International Transfers</h2>
<p>Your data may be transferred to service providers located outside the European Economic Area. In these cases, we ensure that adequate safeguards exist in accordance with the GDPR.</p>`,

  fr: `<h2>1. Responsable du Traitement</h2>
<p>E-PORTS AMPLE DE BANDA I INTERNET, S.L. (ci-après, "EportsTech"), avec NIF B55688410 et siège social à Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragone (Espagne), est le responsable du traitement des données personnelles collectées via ce site web.</p>
<p>Vous pouvez nous contacter à:</p>
<ul>
<li>Email: hola@eportsinternet.com</li>
<li>Téléphone: +34 977 353 735</li>
</ul>

<h2>2. Données que Nous Collectons</h2>
<p>Nous collectons les données personnelles que vous nous fournissez volontairement via nos formulaires de contact: nom complet, adresse e-mail, numéro de téléphone, nom de l'entreprise et message.</p>

<h2>3. Finalité du Traitement</h2>
<p>Nous utilisons vos données pour: (a) répondre à vos demandes et demandes d'information, (b) vous envoyer des devis et propositions commerciales demandés, (c) gérer la relation commerciale si vous devenez client.</p>

<h2>4. Base Juridique</h2>
<p>Le traitement de vos données est basé sur: (a) votre consentement lors de l'envoi du formulaire de contact, (b) l'exécution d'un contrat ou de mesures précontractuelles, (c) notre intérêt légitime.</p>

<h2>5. Conservation des Données</h2>
<p>Nous conserverons vos données personnelles tant qu'une relation commerciale existe et, par la suite, pendant les délais légalement établis.</p>

<h2>6. Droits de l'Utilisateur</h2>
<p>Vous pouvez exercer vos droits d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition en envoyant un email à hola@eportsinternet.com.</p>

<h2>7. Sécurité</h2>
<p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles.</p>

<h2>8. Transferts Internationaux</h2>
<p>Vos données peuvent être transférées à des prestataires de services situés en dehors de l'Espace Économique Européen.</p>`,

  de: `<h2>1. Verantwortlicher</h2>
<p>E-PORTS AMPLE DE BANDA I INTERNET, S.L. (nachfolgend "EportsTech"), mit Steuernummer B55688410 und Sitz in Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona (Spanien), ist der Verantwortliche für die Verarbeitung personenbezogener Daten, die über diese Website erhoben werden.</p>
<p>Sie können uns kontaktieren unter:</p>
<ul>
<li>E-Mail: hola@eportsinternet.com</li>
<li>Telefon: +34 977 353 735</li>
</ul>

<h2>2. Erhobene Daten</h2>
<p>Wir erheben personenbezogene Daten, die Sie uns freiwillig über unsere Kontaktformulare zur Verfügung stellen: vollständiger Name, E-Mail-Adresse, Telefonnummer, Firmenname und Nachricht.</p>

<h2>3. Zweck der Verarbeitung</h2>
<p>Wir verwenden Ihre Daten, um: (a) auf Ihre Anfragen zu antworten, (b) Ihnen angeforderte Angebote und Geschäftsvorschläge zu senden, (c) die Geschäftsbeziehung zu verwalten, wenn Sie Kunde werden.</p>

<h2>4. Rechtsgrundlage</h2>
<p>Die Verarbeitung Ihrer Daten basiert auf: (a) Ihrer Einwilligung beim Absenden des Kontaktformulars, (b) der Durchführung eines Vertrags oder vorvertraglicher Maßnahmen, (c) unserem berechtigten Interesse.</p>

<h2>5. Datenspeicherung</h2>
<p>Wir speichern Ihre personenbezogenen Daten, solange eine Geschäftsbeziehung besteht, und danach für die gesetzlich festgelegten Zeiträume.</p>

<h2>6. Benutzerrechte</h2>
<p>Sie können Ihre Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch ausüben, indem Sie eine E-Mail an hola@eportsinternet.com senden.</p>

<h2>7. Sicherheit</h2>
<p>Wir setzen geeignete technische und organisatorische Maßnahmen um, um Ihre personenbezogenen Daten vor unbefugtem Zugriff, Verlust oder Zerstörung zu schützen.</p>

<h2>8. Internationale Übermittlungen</h2>
<p>Ihre Daten können an Dienstleister übermittelt werden, die außerhalb des Europäischen Wirtschaftsraums ansässig sind.</p>`,

  it: `<h2>1. Titolare del Trattamento</h2>
<p>E-PORTS AMPLE DE BANDA I INTERNET, S.L. (di seguito, "EportsTech"), con Partita IVA B55688410 e sede legale in Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona (Spagna), è il titolare del trattamento dei dati personali raccolti attraverso questo sito web.</p>
<p>Può contattarci a:</p>
<ul>
<li>Email: hola@eportsinternet.com</li>
<li>Telefono: +34 977 353 735</li>
</ul>

<h2>2. Dati Raccolti</h2>
<p>Raccogliamo i dati personali che ci fornisce volontariamente attraverso i nostri moduli di contatto: nome completo, indirizzo e-mail, numero di telefono, nome dell'azienda e messaggio.</p>

<h2>3. Finalità del Trattamento</h2>
<p>Utilizziamo i suoi dati per: (a) rispondere alle sue richieste e richieste di informazioni, (b) inviarle preventivi e proposte commerciali richieste, (c) gestire il rapporto commerciale se diventa cliente.</p>

<h2>4. Base Giuridica</h2>
<p>Il trattamento dei suoi dati si basa su: (a) il suo consenso nell'invio del modulo di contatto, (b) l'esecuzione di un contratto o di misure precontrattuali, (c) il nostro legittimo interesse.</p>

<h2>5. Conservazione dei Dati</h2>
<p>Conserveremo i suoi dati personali finché esiste un rapporto commerciale e, successivamente, per i periodi stabiliti dalla legge.</p>

<h2>6. Diritti dell'Utente</h2>
<p>Può esercitare i suoi diritti di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione inviando un'e-mail a hola@eportsinternet.com.</p>

<h2>7. Sicurezza</h2>
<p>Implementiamo misure tecniche e organizzative appropriate per proteggere i suoi dati personali dall'accesso non autorizzato, dalla perdita o dalla distruzione.</p>

<h2>8. Trasferimenti Internazionali</h2>
<p>I suoi dati possono essere trasferiti a fornitori di servizi situati al di fuori dello Spazio Economico Europeo.</p>`
};

const DEFAULT_TITLES: Record<Language, string> = {
  es: 'Política de Privacidad',
  ca: 'Política de Privacitat',
  en: 'Privacy Policy',
  fr: 'Politique de Confidentialité',
  de: 'Datenschutzrichtlinie',
  it: 'Informativa sulla Privacy'
};

const BACK_TEXT: Record<Language, string> = {
  es: 'Volver al inicio',
  ca: 'Tornar a l\'inici',
  en: 'Back to home',
  fr: 'Retour à l\'accueil',
  de: 'Zurück zur Startseite',
  it: 'Torna alla home'
};

const CONTACT_TEXT: Record<Language, string> = {
  es: '¿Tiene preguntas sobre privacidad?',
  ca: 'Té preguntes sobre privacitat?',
  en: 'Have questions about privacy?',
  fr: 'Des questions sur la confidentialité?',
  de: 'Fragen zum Datenschutz?',
  it: 'Domande sulla privacy?'
};

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ lang }) => {
  const [legalText, setLegalText] = useState<LegalText | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const data = await getLegalText('privacy');
      setLegalText(data);
      setLoading(false);
    };
    loadContent();
  }, []);

  // Usar contingut de BD si existeix i no està buit, sinó usar defecte
  const title = legalText?.title?.[lang] || DEFAULT_TITLES[lang];
  const dbContent = legalText?.content?.[lang];
  const content = dbContent && dbContent.trim() !== '' ? dbContent : DEFAULT_CONTENT[lang];
  const lastUpdate = legalText?.last_updated 
    ? new Date(legalText.last_updated).toLocaleDateString(lang === 'ca' ? 'ca-ES' : lang === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long' })
    : 'Desembre 2025';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-medium"
        >
          <ArrowLeft size={18} />
          {BACK_TEXT[lang]}
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Shield className="text-primary-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-500 text-sm mt-1">
                {lang === 'es' ? 'Última actualización' : lang === 'ca' ? 'Última actualització' : 'Last updated'}: {lastUpdate}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-a:text-primary-600 prose-ul:my-2"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* Contact */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            {CONTACT_TEXT[lang]}{' '}
            <a href="mailto:hola@eportsinternet.com" className="text-primary-600 hover:underline">hola@eportsinternet.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
