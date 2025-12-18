import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Language } from '../types';

interface PrivacyPolicyProps {
  lang: Language;
}

const CONTENT: Record<Language, {
  title: string;
  lastUpdate: string;
  sections: { title: string; content: string }[];
}> = {
  es: {
    title: 'Política de Privacidad',
    lastUpdate: 'Última actualización: Diciembre 2025',
    sections: [
      {
        title: '1. Responsable del Tratamiento',
        content: `E-PORTS AMPLE DE BANDA I INTERNET, S.L. (en adelante, "EportsTech"), con CIF B55688410 y domicilio social en Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona (España), es el responsable del tratamiento de los datos personales recogidos a través de este sitio web.

Puede contactar con nosotros en:
• Email: hola@eportsinternet.com
• Teléfono: 977 353 735`
      },
      {
        title: '2. Datos que Recopilamos',
        content: `Recopilamos los datos personales que usted nos proporciona voluntariamente a través de nuestros formularios de contacto: nombre completo, dirección de correo electrónico, número de teléfono, nombre de la empresa y mensaje. También recopilamos automáticamente datos de navegación mediante cookies (ver Política de Cookies).`
      },
      {
        title: '3. Finalidad del Tratamiento',
        content: `Utilizamos sus datos para: (a) responder a sus consultas y solicitudes de información, (b) enviarle presupuestos y propuestas comerciales solicitadas, (c) gestionar la relación comercial si se convierte en cliente, (d) enviarle comunicaciones comerciales si ha dado su consentimiento expreso.`
      },
      {
        title: '4. Base Legal',
        content: `El tratamiento de sus datos se basa en: (a) su consentimiento al enviar el formulario de contacto, (b) la ejecución de un contrato o medidas precontractuales, (c) nuestro interés legítimo en atender sus consultas y mejorar nuestros servicios.`
      },
      {
        title: '5. Conservación de Datos',
        content: `Conservaremos sus datos personales mientras exista una relación comercial y, posteriormente, durante los plazos legalmente establecidos. Los datos de contacto de leads se conservan durante un máximo de 2 años si no se establece relación comercial.`
      },
      {
        title: '6. Derechos del Usuario',
        content: `Puede ejercer sus derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición enviando un email a hola@eportsinternet.com junto con una copia de su DNI. También tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).`
      },
      {
        title: '7. Seguridad',
        content: `Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso no autorizado, la pérdida o la destrucción. Utilizamos cifrado SSL/TLS en todas las comunicaciones y almacenamos los datos en servidores seguros.`
      },
      {
        title: '8. Transferencias Internacionales',
        content: `Sus datos pueden ser transferidos a proveedores de servicios ubicados fuera del Espacio Económico Europeo. En estos casos, garantizamos que existen las salvaguardias adecuadas conforme al RGPD.`
      }
    ]
  },
  ca: {
    title: 'Política de Privacitat',
    lastUpdate: 'Última actualització: Desembre 2025',
    sections: [
      {
        title: '1. Responsable del Tractament',
        content: `E-PORTS AMPLE DE BANDA I INTERNET, S.L. (en endavant, "EportsTech"), amb CIF B55688410 i domicili social a Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona (Espanya), és el responsable del tractament de les dades personals recollides a través d'aquest lloc web.

Pot contactar amb nosaltres a:
• Email: hola@eportsinternet.com
• Telèfon: 977 353 735`
      },
      {
        title: '2. Dades que Recopilem',
        content: `Recopilem les dades personals que vostè ens proporciona voluntàriament a través dels nostres formularis de contacte: nom complet, adreça de correu electrònic, número de telèfon, nom de l'empresa i missatge. També recopilem automàticament dades de navegació mitjançant cookies (veure Política de Cookies).`
      },
      {
        title: '3. Finalitat del Tractament',
        content: `Utilitzem les seves dades per: (a) respondre a les seves consultes i sol·licituds d'informació, (b) enviar-li pressupostos i propostes comercials sol·licitades, (c) gestionar la relació comercial si es converteix en client, (d) enviar-li comunicacions comercials si ha donat el seu consentiment exprés.`
      },
      {
        title: '4. Base Legal',
        content: `El tractament de les seves dades es basa en: (a) el seu consentiment en enviar el formulari de contacte, (b) l'execució d'un contracte o mesures precontractuals, (c) el nostre interès legítim en atendre les seves consultes i millorar els nostres serveis.`
      },
      {
        title: '5. Conservació de Dades',
        content: `Conservarem les seves dades personals mentre existeixi una relació comercial i, posteriorment, durant els terminis legalment establerts. Les dades de contacte de leads es conserven durant un màxim de 2 anys si no s'estableix relació comercial.`
      },
      {
        title: '6. Drets de l\'Usuari',
        content: `Pot exercir els seus drets d'accés, rectificació, supressió, limitació, portabilitat i oposició enviant un email a hola@eportsinternet.com juntament amb una còpia del seu DNI. També té dret a presentar una reclamació davant l'Agència Espanyola de Protecció de Dades (AEPD).`
      },
      {
        title: '7. Seguretat',
        content: `Implementem mesures tècniques i organitzatives apropiades per protegir les seves dades personals contra l'accés no autoritzat, la pèrdua o la destrucció. Utilitzem xifrat SSL/TLS en totes les comunicacions i emmagatzemem les dades en servidors segurs.`
      },
      {
        title: '8. Transferències Internacionals',
        content: `Les seves dades poden ser transferides a proveïdors de serveis ubicats fora de l'Espai Econòmic Europeu. En aquests casos, garantim que existeixen les salvaguardes adequades conforme al RGPD.`
      }
    ]
  },
  en: {
    title: 'Privacy Policy',
    lastUpdate: 'Last updated: December 2025',
    sections: [
      {
        title: '1. Data Controller',
        content: `E-PORTS AMPLE DE BANDA I INTERNET, S.L. (hereinafter, "EportsTech"), with Tax ID B55688410 and registered office at Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona (Spain), is the data controller for personal data collected through this website.

You can contact us at:
• Email: hola@eportsinternet.com
• Phone: +34 977 353 735`
      },
      {
        title: '2. Data We Collect',
        content: `We collect personal data that you voluntarily provide through our contact forms: full name, email address, phone number, company name, and message. We also automatically collect browsing data through cookies (see Cookies Policy).`
      },
      {
        title: '3. Purpose of Processing',
        content: `We use your data to: (a) respond to your inquiries and information requests, (b) send you requested quotes and commercial proposals, (c) manage the commercial relationship if you become a customer, (d) send you commercial communications if you have given your express consent.`
      },
      {
        title: '4. Legal Basis',
        content: `The processing of your data is based on: (a) your consent when submitting the contact form, (b) the execution of a contract or pre-contractual measures, (c) our legitimate interest in attending to your inquiries and improving our services.`
      },
      {
        title: '5. Data Retention',
        content: `We will retain your personal data as long as a commercial relationship exists and, subsequently, for the legally established periods. Lead contact data is retained for a maximum of 2 years if no commercial relationship is established.`
      },
      {
        title: '6. User Rights',
        content: `You can exercise your rights of access, rectification, erasure, restriction, portability, and objection by sending an email to info@eportstech.com along with a copy of your ID. You also have the right to file a complaint with the Spanish Data Protection Agency (AEPD).`
      },
      {
        title: '7. Security',
        content: `We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or destruction. We use SSL/TLS encryption in all communications and store data on secure servers.`
      },
      {
        title: '8. International Transfers',
        content: `Your data may be transferred to service providers located outside the European Economic Area. In these cases, we ensure that appropriate safeguards exist in accordance with GDPR.`
      }
    ]
  },
  fr: {
    title: 'Politique de Confidentialité',
    lastUpdate: 'Dernière mise à jour: Décembre 2025',
    sections: [
      {
        title: '1. Responsable du Traitement',
        content: `E-PORTS AMPLE DE BANDA I INTERNET, S.L. (ci-après, "EportsTech"), avec NIF B55688410 et siège social à Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragone (Espagne), est le responsable du traitement des données personnelles collectées via ce site web.

Vous pouvez nous contacter à:
• Email: hola@eportsinternet.com
• Téléphone: +34 977 353 735`
      },
      {
        title: '2. Données Collectées',
        content: `Nous collectons les données personnelles que vous nous fournissez volontairement via nos formulaires de contact: nom complet, adresse e-mail, numéro de téléphone, nom de l'entreprise et message. Nous collectons également automatiquement des données de navigation via des cookies (voir Politique de Cookies).`
      },
      {
        title: '3. Finalité du Traitement',
        content: `Nous utilisons vos données pour: (a) répondre à vos demandes et requêtes d'information, (b) vous envoyer des devis et propositions commerciales demandés, (c) gérer la relation commerciale si vous devenez client, (d) vous envoyer des communications commerciales si vous avez donné votre consentement exprès.`
      },
      {
        title: '4. Base Juridique',
        content: `Le traitement de vos données est basé sur: (a) votre consentement lors de l'envoi du formulaire de contact, (b) l'exécution d'un contrat ou de mesures précontractuelles, (c) notre intérêt légitime à répondre à vos demandes et améliorer nos services.`
      },
      {
        title: '5. Conservation des Données',
        content: `Nous conserverons vos données personnelles tant qu'une relation commerciale existe et, par la suite, pendant les délais légalement établis. Les données de contact des prospects sont conservées pendant un maximum de 2 ans si aucune relation commerciale n'est établie.`
      },
      {
        title: '6. Droits de l\'Utilisateur',
        content: `Vous pouvez exercer vos droits d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition en envoyant un e-mail à info@eportstech.com accompagné d'une copie de votre pièce d'identité.`
      },
      {
        title: '7. Sécurité',
        content: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre l'accès non autorisé, la perte ou la destruction. Nous utilisons le chiffrement SSL/TLS pour toutes les communications.`
      },
      {
        title: '8. Transferts Internationaux',
        content: `Vos données peuvent être transférées à des prestataires de services situés en dehors de l'Espace Économique Européen. Dans ces cas, nous garantissons l'existence de garanties appropriées conformément au RGPD.`
      }
    ]
  },
  de: {
    title: 'Datenschutzrichtlinie',
    lastUpdate: 'Letzte Aktualisierung: Dezember 2025',
    sections: [
      {
        title: '1. Verantwortlicher',
        content: `E-PORTS AMPLE DE BANDA I INTERNET, S.L. (nachfolgend "EportsTech"), mit Steuernummer B55688410 und Sitz in Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona (Spanien), ist verantwortlich für die Verarbeitung der über diese Website erhobenen personenbezogenen Daten.

Sie können uns kontaktieren unter:
• E-Mail: hola@eportsinternet.com
• Telefon: +34 977 353 735`
      },
      {
        title: '2. Erhobene Daten',
        content: `Wir erheben personenbezogene Daten, die Sie uns freiwillig über unsere Kontaktformulare zur Verfügung stellen: vollständiger Name, E-Mail-Adresse, Telefonnummer, Firmenname und Nachricht. Wir erheben auch automatisch Browsing-Daten durch Cookies (siehe Cookie-Richtlinie).`
      },
      {
        title: '3. Zweck der Verarbeitung',
        content: `Wir verwenden Ihre Daten, um: (a) auf Ihre Anfragen zu antworten, (b) Ihnen angeforderte Angebote und Geschäftsvorschläge zu senden, (c) die Geschäftsbeziehung zu verwalten, wenn Sie Kunde werden, (d) Ihnen kommerzielle Mitteilungen zu senden, wenn Sie Ihre ausdrückliche Zustimmung gegeben haben.`
      },
      {
        title: '4. Rechtsgrundlage',
        content: `Die Verarbeitung Ihrer Daten basiert auf: (a) Ihrer Einwilligung beim Absenden des Kontaktformulars, (b) der Durchführung eines Vertrags oder vorvertraglicher Maßnahmen, (c) unserem berechtigten Interesse, Ihre Anfragen zu beantworten und unsere Dienste zu verbessern.`
      },
      {
        title: '5. Datenspeicherung',
        content: `Wir speichern Ihre personenbezogenen Daten, solange eine Geschäftsbeziehung besteht, und danach für die gesetzlich festgelegten Zeiträume. Lead-Kontaktdaten werden maximal 2 Jahre aufbewahrt, wenn keine Geschäftsbeziehung zustande kommt.`
      },
      {
        title: '6. Benutzerrechte',
        content: `Sie können Ihre Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch ausüben, indem Sie eine E-Mail an info@eportstech.com zusammen mit einer Kopie Ihres Ausweises senden.`
      },
      {
        title: '7. Sicherheit',
        content: `Wir setzen geeignete technische und organisatorische Maßnahmen um, um Ihre personenbezogenen Daten vor unbefugtem Zugriff, Verlust oder Zerstörung zu schützen. Wir verwenden SSL/TLS-Verschlüsselung bei allen Kommunikationen.`
      },
      {
        title: '8. Internationale Übermittlungen',
        content: `Ihre Daten können an Dienstleister übermittelt werden, die außerhalb des Europäischen Wirtschaftsraums ansässig sind. In diesen Fällen stellen wir sicher, dass gemäß DSGVO geeignete Garantien bestehen.`
      }
    ]
  },
  it: {
    title: 'Politica sulla Privacy',
    lastUpdate: 'Ultimo aggiornamento: Dicembre 2025',
    sections: [
      {
        title: '1. Titolare del Trattamento',
        content: `E-PORTS AMPLE DE BANDA I INTERNET, S.L. (di seguito, "EportsTech"), con Partita IVA B55688410 e sede legale in Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona (Spagna), è il titolare del trattamento dei dati personali raccolti attraverso questo sito web.

Può contattarci a:
• Email: hola@eportsinternet.com
• Telefono: +34 977 353 735`
      },
      {
        title: '2. Dati Raccolti',
        content: `Raccogliamo i dati personali che ci fornisce volontariamente attraverso i nostri moduli di contatto: nome completo, indirizzo e-mail, numero di telefono, nome dell'azienda e messaggio. Raccogliamo anche automaticamente dati di navigazione attraverso i cookie (vedere Politica dei Cookie).`
      },
      {
        title: '3. Finalità del Trattamento',
        content: `Utilizziamo i suoi dati per: (a) rispondere alle sue richieste e richieste di informazioni, (b) inviarle preventivi e proposte commerciali richieste, (c) gestire il rapporto commerciale se diventa cliente, (d) inviarle comunicazioni commerciali se ha dato il suo consenso esplicito.`
      },
      {
        title: '4. Base Giuridica',
        content: `Il trattamento dei suoi dati si basa su: (a) il suo consenso nell'invio del modulo di contatto, (b) l'esecuzione di un contratto o di misure precontrattuali, (c) il nostro legittimo interesse a rispondere alle sue richieste e migliorare i nostri servizi.`
      },
      {
        title: '5. Conservazione dei Dati',
        content: `Conserveremo i suoi dati personali finché esiste un rapporto commerciale e, successivamente, per i periodi stabiliti dalla legge. I dati di contatto dei lead vengono conservati per un massimo di 2 anni se non viene stabilito un rapporto commerciale.`
      },
      {
        title: '6. Diritti dell\'Utente',
        content: `Può esercitare i suoi diritti di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione inviando un'e-mail a info@eportstech.com insieme a una copia del suo documento d'identità.`
      },
      {
        title: '7. Sicurezza',
        content: `Implementiamo misure tecniche e organizzative appropriate per proteggere i suoi dati personali dall'accesso non autorizzato, dalla perdita o dalla distruzione. Utilizziamo la crittografia SSL/TLS in tutte le comunicazioni.`
      },
      {
        title: '8. Trasferimenti Internazionali',
        content: `I suoi dati possono essere trasferiti a fornitori di servizi situati al di fuori dello Spazio Economico Europeo. In questi casi, garantiamo l'esistenza di garanzie adeguate in conformità con il GDPR.`
      }
    ]
  }
};

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ lang }) => {
  const content = CONTENT[lang] || CONTENT.es;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-medium"
        >
          <ArrowLeft size={18} />
          {lang === 'es' ? 'Volver al inicio' : lang === 'ca' ? 'Tornar a l\'inici' : lang === 'en' ? 'Back to home' : lang === 'fr' ? 'Retour à l\'accueil' : lang === 'de' ? 'Zurück zur Startseite' : 'Torna alla home'}
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Shield className="text-primary-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
              <p className="text-gray-500 text-sm mt-1">{content.lastUpdate}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-8">
            {content.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            {lang === 'es' ? '¿Tiene preguntas sobre privacidad?' : lang === 'ca' ? 'Té preguntes sobre privacitat?' : 'Have questions about privacy?'}{' '}
            <a href="mailto:hola@eportsinternet.com" className="text-primary-600 hover:underline">hola@eportsinternet.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
