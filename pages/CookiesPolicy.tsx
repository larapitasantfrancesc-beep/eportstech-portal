import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Loader2 } from 'lucide-react';
import { Language } from '../types';
import { getLegalText, LegalText } from '../services/supabaseMock';

interface CookiesPolicyProps {
  lang: Language;
}

// Contingut per defecte (el que ja teníeu)
const DEFAULT_CONTENT: Record<Language, string> = {
  es: `<h2>1. ¿Qué son las cookies?</h2>
<p>Las cookies son pequeños archivos de texto que los sitios web almacenan en su dispositivo (ordenador, tablet, móvil) cuando los visita. Las cookies permiten que el sitio web recuerde sus acciones y preferencias durante un período de tiempo, para que no tenga que volver a introducirlos cada vez que visite el sitio o navegue de una página a otra.</p>

<h2>2. Tipos de cookies que utilizamos</h2>
<p><strong>Cookies técnicas (necesarias):</strong> Son esenciales para el funcionamiento del sitio web. Permiten navegar por la página y utilizar sus funciones básicas. Sin estas cookies, el sitio web no funcionaría correctamente.</p>
<p><strong>Cookies analíticas:</strong> Nos ayudan a entender cómo los visitantes interactúan con el sitio web, proporcionando información sobre las áreas visitadas, el tiempo de visita y cualquier problema encontrado. Utilizamos Google Analytics para este fin.</p>
<p><strong>Cookies de preferencias:</strong> Permiten que el sitio web recuerde sus preferencias (como el idioma seleccionado) para ofrecerle una experiencia más personalizada.</p>

<h2>3. Cookies de terceros</h2>
<p>Este sitio web utiliza servicios de terceros que pueden establecer sus propias cookies:</p>
<ul>
<li><strong>Google Analytics:</strong> Para análisis de tráfico web. Puede consultar su política de privacidad en: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">https://policies.google.com/privacy</a></li>
<li><strong>Google Tag Manager:</strong> Para gestión de etiquetas y seguimiento.</li>
</ul>
<p>Estos terceros pueden transferir datos fuera del Espacio Económico Europeo. Puede obtener más información sobre sus políticas de privacidad visitando sus sitios web.</p>

<h2>4. Duración de las cookies</h2>
<p><strong>Cookies de sesión:</strong> Se eliminan automáticamente cuando cierra su navegador.</p>
<p><strong>Cookies persistentes:</strong> Permanecen en su dispositivo durante un período determinado o hasta que las elimine manualmente. Las cookies analíticas de Google Analytics tienen una duración de 2 años.</p>

<h2>5. Gestión de cookies</h2>
<p>Puede controlar y/o eliminar las cookies según desee. Puede eliminar todas las cookies que ya están en su dispositivo y puede configurar la mayoría de los navegadores para evitar que se coloquen.</p>
<p>Para gestionar las cookies en los navegadores más comunes:</p>
<ul>
<li><strong>Chrome:</strong> Configuración > Privacidad y seguridad > Cookies</li>
<li><strong>Firefox:</strong> Opciones > Privacidad y seguridad</li>
<li><strong>Safari:</strong> Preferencias > Privacidad</li>
<li><strong>Edge:</strong> Configuración > Privacidad y servicios</li>
</ul>
<p>Tenga en cuenta que si desactiva las cookies, es posible que algunas funciones del sitio web no funcionen correctamente.</p>

<h2>6. Consentimiento</h2>
<p>Al continuar navegando por nuestro sitio web, acepta el uso de cookies de acuerdo con esta política. Si no está de acuerdo, puede configurar su navegador para rechazar las cookies o abandonar el sitio web.</p>

<h2>7. Actualizaciones de esta política</h2>
<p>Podemos actualizar esta Política de Cookies periódicamente. Le recomendamos que revise esta página regularmente para estar informado de cualquier cambio.</p>`,

  ca: `<h2>1. Què són les cookies?</h2>
<p>Les cookies són petits arxius de text que els llocs web emmagatzemen al seu dispositiu (ordinador, tablet, mòbil) quan els visita. Les cookies permeten que el lloc web recordi les seves accions i preferències durant un període de temps, perquè no hagi de tornar a introduir-les cada vegada que visiti el lloc o navegui d'una pàgina a una altra.</p>

<h2>2. Tipus de cookies que utilitzem</h2>
<p><strong>Cookies tècniques (necessàries):</strong> Són essencials per al funcionament del lloc web. Permeten navegar per la pàgina i utilitzar les seves funcions bàsiques. Sense aquestes cookies, el lloc web no funcionaria correctament.</p>
<p><strong>Cookies analítiques:</strong> Ens ajuden a entendre com els visitants interactuen amb el lloc web, proporcionant informació sobre les àrees visitades, el temps de visita i qualsevol problema trobat. Utilitzem Google Analytics per a aquest fi.</p>
<p><strong>Cookies de preferències:</strong> Permeten que el lloc web recordi les seves preferències (com l'idioma seleccionat) per oferir-li una experiència més personalitzada.</p>

<h2>3. Cookies de tercers</h2>
<p>Aquest lloc web utilitza serveis de tercers que poden establir les seves pròpies cookies:</p>
<ul>
<li><strong>Google Analytics:</strong> Per a anàlisi de tràfic web. Pot consultar la seva política de privacitat a: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">https://policies.google.com/privacy</a></li>
<li><strong>Google Tag Manager:</strong> Per a gestió d'etiquetes i seguiment.</li>
</ul>
<p>Aquests tercers poden transferir dades fora de l'Espai Econòmic Europeu. Pot obtenir més informació sobre les seves polítiques de privacitat visitant els seus llocs web.</p>

<h2>4. Durada de les cookies</h2>
<p><strong>Cookies de sessió:</strong> S'eliminen automàticament quan tanca el seu navegador.</p>
<p><strong>Cookies persistents:</strong> Romanen al seu dispositiu durant un període determinat o fins que les elimini manualment. Les cookies analítiques de Google Analytics tenen una durada de 2 anys.</p>

<h2>5. Gestió de cookies</h2>
<p>Pot controlar i/o eliminar les cookies segons desitgi. Pot eliminar totes les cookies que ja estan al seu dispositiu i pot configurar la majoria dels navegadors per evitar que es col·loquin.</p>
<p>Per gestionar les cookies als navegadors més comuns:</p>
<ul>
<li><strong>Chrome:</strong> Configuració > Privacitat i seguretat > Cookies</li>
<li><strong>Firefox:</strong> Opcions > Privacitat i seguretat</li>
<li><strong>Safari:</strong> Preferències > Privacitat</li>
<li><strong>Edge:</strong> Configuració > Privacitat i serveis</li>
</ul>
<p>Tingui en compte que si desactiva les cookies, és possible que algunes funcions del lloc web no funcionin correctament.</p>

<h2>6. Consentiment</h2>
<p>En continuar navegant pel nostre lloc web, accepta l'ús de cookies d'acord amb aquesta política. Si no hi està d'acord, pot configurar el seu navegador per rebutjar les cookies o abandonar el lloc web.</p>

<h2>7. Actualitzacions d'aquesta política</h2>
<p>Podem actualitzar aquesta Política de Cookies periòdicament. Li recomanem que revisi aquesta pàgina regularment per estar informat de qualsevol canvi.</p>`,

  en: `<h2>1. What are cookies?</h2>
<p>Cookies are small text files that websites store on your device (computer, tablet, mobile) when you visit them. Cookies allow the website to remember your actions and preferences over a period of time, so you don't have to re-enter them every time you visit the site or navigate from one page to another.</p>

<h2>2. Types of cookies we use</h2>
<p><strong>Technical cookies (necessary):</strong> These are essential for the website to function. They allow you to navigate the page and use its basic functions. Without these cookies, the website would not work properly.</p>
<p><strong>Analytical cookies:</strong> They help us understand how visitors interact with the website, providing information about areas visited, time spent, and any problems encountered. We use Google Analytics for this purpose.</p>
<p><strong>Preference cookies:</strong> They allow the website to remember your preferences (such as the selected language) to offer you a more personalized experience.</p>

<h2>3. Third-party cookies</h2>
<p>This website uses third-party services that may set their own cookies:</p>
<ul>
<li><strong>Google Analytics:</strong> For web traffic analysis. You can consult their privacy policy at: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">https://policies.google.com/privacy</a></li>
<li><strong>Google Tag Manager:</strong> For tag management and tracking.</li>
</ul>
<p>These third parties may transfer data outside the European Economic Area. You can obtain more information about their privacy policies by visiting their websites.</p>

<h2>4. Cookie duration</h2>
<p><strong>Session cookies:</strong> They are automatically deleted when you close your browser.</p>
<p><strong>Persistent cookies:</strong> They remain on your device for a set period or until you manually delete them. Google Analytics analytical cookies have a duration of 2 years.</p>

<h2>5. Managing cookies</h2>
<p>You can control and/or delete cookies as you wish. You can delete all cookies already on your device and you can configure most browsers to prevent them from being placed.</p>
<p>To manage cookies in the most common browsers:</p>
<ul>
<li><strong>Chrome:</strong> Settings > Privacy and security > Cookies</li>
<li><strong>Firefox:</strong> Options > Privacy and security</li>
<li><strong>Safari:</strong> Preferences > Privacy</li>
<li><strong>Edge:</strong> Settings > Privacy and services</li>
</ul>
<p>Note that if you disable cookies, some website features may not work properly.</p>

<h2>6. Consent</h2>
<p>By continuing to browse our website, you accept the use of cookies in accordance with this policy. If you do not agree, you can configure your browser to reject cookies or leave the website.</p>

<h2>7. Updates to this policy</h2>
<p>We may update this Cookies Policy periodically. We recommend that you review this page regularly to stay informed of any changes.</p>`,

  fr: `<h2>1. Que sont les cookies?</h2>
<p>Les cookies sont de petits fichiers texte que les sites web stockent sur votre appareil lorsque vous les visitez. Les cookies permettent au site web de mémoriser vos actions et préférences.</p>

<h2>2. Types de cookies que nous utilisons</h2>
<p><strong>Cookies techniques (nécessaires):</strong> Ils sont essentiels au fonctionnement du site web.</p>
<p><strong>Cookies analytiques:</strong> Ils nous aident à comprendre comment les visiteurs interagissent avec le site web. Nous utilisons Google Analytics à cette fin.</p>
<p><strong>Cookies de préférences:</strong> Ils permettent au site web de mémoriser vos préférences.</p>

<h2>3. Cookies de tiers</h2>
<p>Ce site web utilise des services de tiers qui peuvent définir leurs propres cookies:</p>
<ul>
<li><strong>Google Analytics:</strong> Pour l'analyse du trafic web.</li>
<li><strong>Google Tag Manager:</strong> Pour la gestion des balises et le suivi.</li>
</ul>

<h2>4. Durée des cookies</h2>
<p><strong>Cookies de session:</strong> Ils sont automatiquement supprimés lorsque vous fermez votre navigateur.</p>
<p><strong>Cookies persistants:</strong> Ils restent sur votre appareil pendant une période déterminée.</p>

<h2>5. Gestion des cookies</h2>
<p>Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez.</p>

<h2>6. Consentement</h2>
<p>En continuant à naviguer sur notre site web, vous acceptez l'utilisation de cookies conformément à cette politique.</p>

<h2>7. Mises à jour de cette politique</h2>
<p>Nous pouvons mettre à jour cette Politique de Cookies périodiquement.</p>`,

  de: `<h2>1. Was sind Cookies?</h2>
<p>Cookies sind kleine Textdateien, die Websites auf Ihrem Gerät speichern, wenn Sie sie besuchen. Cookies ermöglichen es der Website, Ihre Aktionen und Präferenzen zu speichern.</p>

<h2>2. Arten von Cookies, die wir verwenden</h2>
<p><strong>Technische Cookies (notwendig):</strong> Sie sind für das Funktionieren der Website unerlässlich.</p>
<p><strong>Analytische Cookies:</strong> Sie helfen uns zu verstehen, wie Besucher mit der Website interagieren. Wir verwenden Google Analytics zu diesem Zweck.</p>
<p><strong>Präferenz-Cookies:</strong> Sie ermöglichen es der Website, Ihre Präferenzen zu speichern.</p>

<h2>3. Cookies von Drittanbietern</h2>
<p>Diese Website verwendet Dienste von Drittanbietern:</p>
<ul>
<li><strong>Google Analytics:</strong> Für die Analyse des Web-Traffics.</li>
<li><strong>Google Tag Manager:</strong> Für Tag-Management und Tracking.</li>
</ul>

<h2>4. Cookie-Dauer</h2>
<p><strong>Sitzungs-Cookies:</strong> Sie werden automatisch gelöscht, wenn Sie Ihren Browser schließen.</p>
<p><strong>Dauerhafte Cookies:</strong> Sie bleiben auf Ihrem Gerät für einen bestimmten Zeitraum.</p>

<h2>5. Cookie-Verwaltung</h2>
<p>Sie können Cookies nach Belieben kontrollieren und/oder löschen.</p>

<h2>6. Einwilligung</h2>
<p>Indem Sie weiterhin auf unserer Website surfen, akzeptieren Sie die Verwendung von Cookies gemäß dieser Richtlinie.</p>

<h2>7. Aktualisierungen dieser Richtlinie</h2>
<p>Wir können diese Cookie-Richtlinie regelmäßig aktualisieren.</p>`,

  it: `<h2>1. Cosa sono i cookie?</h2>
<p>I cookie sono piccoli file di testo che i siti web memorizzano sul tuo dispositivo quando li visiti. I cookie permettono al sito web di ricordare le tue azioni e preferenze.</p>

<h2>2. Tipi di cookie che utilizziamo</h2>
<p><strong>Cookie tecnici (necessari):</strong> Sono essenziali per il funzionamento del sito web.</p>
<p><strong>Cookie analitici:</strong> Ci aiutano a capire come i visitatori interagiscono con il sito web. Utilizziamo Google Analytics per questo scopo.</p>
<p><strong>Cookie di preferenza:</strong> Permettono al sito web di ricordare le tue preferenze.</p>

<h2>3. Cookie di terze parti</h2>
<p>Questo sito web utilizza servizi di terze parti:</p>
<ul>
<li><strong>Google Analytics:</strong> Per l'analisi del traffico web.</li>
<li><strong>Google Tag Manager:</strong> Per la gestione dei tag e il tracciamento.</li>
</ul>

<h2>4. Durata dei cookie</h2>
<p><strong>Cookie di sessione:</strong> Vengono automaticamente eliminati quando chiudi il browser.</p>
<p><strong>Cookie persistenti:</strong> Rimangono sul tuo dispositivo per un periodo determinato.</p>

<h2>5. Gestione dei cookie</h2>
<p>Puoi controllare e/o eliminare i cookie come desideri.</p>

<h2>6. Consenso</h2>
<p>Continuando a navigare sul nostro sito web, accetti l'uso dei cookie in conformità con questa politica.</p>

<h2>7. Aggiornamenti di questa politica</h2>
<p>Potremmo aggiornare periodicamente questa Politica dei Cookie.</p>`
};

const DEFAULT_TITLES: Record<Language, string> = {
  es: 'Política de Cookies',
  ca: 'Política de Cookies',
  en: 'Cookies Policy',
  fr: 'Politique de Cookies',
  de: 'Cookie-Richtlinie',
  it: 'Politica dei Cookie'
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
  es: '¿Tiene preguntas sobre cookies?',
  ca: 'Té preguntes sobre cookies?',
  en: 'Have questions about cookies?',
  fr: 'Des questions sur les cookies?',
  de: 'Fragen zu Cookies?',
  it: 'Domande sui cookie?'
};

const CookiesPolicy: React.FC<CookiesPolicyProps> = ({ lang }) => {
  const [legalText, setLegalText] = useState<LegalText | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const data = await getLegalText('cookies');
      setLegalText(data);
      setLoading(false);
    };
    loadContent();
  }, []);

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
            <div className="p-3 bg-amber-100 rounded-xl">
              <Cookie className="text-amber-600" size={28} />
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

export default CookiesPolicy;
