import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';
import { Language } from '../types';

interface CookiesPolicyProps {
  lang: Language;
}

const CONTENT: Record<Language, {
  title: string;
  lastUpdate: string;
  sections: { title: string; content: string }[];
}> = {
  es: {
    title: 'Política de Cookies',
    lastUpdate: 'Última actualización: Diciembre 2025',
    sections: [
      {
        title: '1. ¿Qué son las cookies?',
        content: `Las cookies son pequeños archivos de texto que los sitios web almacenan en su dispositivo (ordenador, tablet, móvil) cuando los visita. Las cookies permiten que el sitio web recuerde sus acciones y preferencias durante un período de tiempo, para que no tenga que volver a introducirlos cada vez que visite el sitio o navegue de una página a otra.`
      },
      {
        title: '2. Tipos de cookies que utilizamos',
        content: `• Cookies técnicas (necesarias): Son esenciales para el funcionamiento del sitio web. Permiten navegar por la página y utilizar sus funciones básicas. Sin estas cookies, el sitio web no funcionaría correctamente.

• Cookies analíticas: Nos ayudan a entender cómo los visitantes interactúan con el sitio web, proporcionando información sobre las áreas visitadas, el tiempo de visita y cualquier problema encontrado. Utilizamos Google Analytics para este fin.

• Cookies de preferencias: Permiten que el sitio web recuerde sus preferencias (como el idioma seleccionado) para ofrecerle una experiencia más personalizada.`
      },
      {
        title: '3. Cookies de terceros',
        content: `Este sitio web utiliza servicios de terceros que pueden establecer sus propias cookies:

• Google Analytics: Para análisis de tráfico web. Puede consultar su política de privacidad en: https://policies.google.com/privacy

• Google Tag Manager: Para gestión de etiquetas y seguimiento.

Estos terceros pueden transferir datos fuera del Espacio Económico Europeo. Puede obtener más información sobre sus políticas de privacidad visitando sus sitios web.`
      },
      {
        title: '4. Duración de las cookies',
        content: `• Cookies de sesión: Se eliminan automáticamente cuando cierra su navegador.

• Cookies persistentes: Permanecen en su dispositivo durante un período determinado o hasta que las elimine manualmente. Las cookies analíticas de Google Analytics tienen una duración de 2 años.`
      },
      {
        title: '5. Gestión de cookies',
        content: `Puede controlar y/o eliminar las cookies según desee. Puede eliminar todas las cookies que ya están en su dispositivo y puede configurar la mayoría de los navegadores para evitar que se coloquen.

Para gestionar las cookies en los navegadores más comunes:

• Chrome: Configuración > Privacidad y seguridad > Cookies
• Firefox: Opciones > Privacidad y seguridad
• Safari: Preferencias > Privacidad
• Edge: Configuración > Privacidad y servicios

Tenga en cuenta que si desactiva las cookies, es posible que algunas funciones del sitio web no funcionen correctamente.`
      },
      {
        title: '6. Consentimiento',
        content: `Al continuar navegando por nuestro sitio web, acepta el uso de cookies de acuerdo con esta política. Si no está de acuerdo, puede configurar su navegador para rechazar las cookies o abandonar el sitio web.`
      },
      {
        title: '7. Actualizaciones de esta política',
        content: `Podemos actualizar esta Política de Cookies periódicamente. Le recomendamos que revise esta página regularmente para estar informado de cualquier cambio.`
      }
    ]
  },
  ca: {
    title: 'Política de Cookies',
    lastUpdate: 'Última actualització: Desembre 2025',
    sections: [
      {
        title: '1. Què són les cookies?',
        content: `Les cookies són petits arxius de text que els llocs web emmagatzemen al seu dispositiu (ordinador, tablet, mòbil) quan els visita. Les cookies permeten que el lloc web recordi les seves accions i preferències durant un període de temps, perquè no hagi de tornar a introduir-les cada vegada que visiti el lloc o navegui d'una pàgina a una altra.`
      },
      {
        title: '2. Tipus de cookies que utilitzem',
        content: `• Cookies tècniques (necessàries): Són essencials per al funcionament del lloc web. Permeten navegar per la pàgina i utilitzar les seves funcions bàsiques. Sense aquestes cookies, el lloc web no funcionaria correctament.

• Cookies analítiques: Ens ajuden a entendre com els visitants interactuen amb el lloc web, proporcionant informació sobre les àrees visitades, el temps de visita i qualsevol problema trobat. Utilitzem Google Analytics per a aquest fi.

• Cookies de preferències: Permeten que el lloc web recordi les seves preferències (com l'idioma seleccionat) per oferir-li una experiència més personalitzada.`
      },
      {
        title: '3. Cookies de tercers',
        content: `Aquest lloc web utilitza serveis de tercers que poden establir les seves pròpies cookies:

• Google Analytics: Per a anàlisi de tràfic web. Pot consultar la seva política de privacitat a: https://policies.google.com/privacy

• Google Tag Manager: Per a gestió d'etiquetes i seguiment.

Aquests tercers poden transferir dades fora de l'Espai Econòmic Europeu. Pot obtenir més informació sobre les seves polítiques de privacitat visitant els seus llocs web.`
      },
      {
        title: '4. Durada de les cookies',
        content: `• Cookies de sessió: S'eliminen automàticament quan tanca el seu navegador.

• Cookies persistents: Romanen al seu dispositiu durant un període determinat o fins que les elimini manualment. Les cookies analítiques de Google Analytics tenen una durada de 2 anys.`
      },
      {
        title: '5. Gestió de cookies',
        content: `Pot controlar i/o eliminar les cookies segons desitgi. Pot eliminar totes les cookies que ja estan al seu dispositiu i pot configurar la majoria dels navegadors per evitar que es col·loquin.

Per gestionar les cookies als navegadors més comuns:

• Chrome: Configuració > Privacitat i seguretat > Cookies
• Firefox: Opcions > Privacitat i seguretat
• Safari: Preferències > Privacitat
• Edge: Configuració > Privacitat i serveis

Tingui en compte que si desactiva les cookies, és possible que algunes funcions del lloc web no funcionin correctament.`
      },
      {
        title: '6. Consentiment',
        content: `En continuar navegant pel nostre lloc web, accepta l'ús de cookies d'acord amb aquesta política. Si no hi està d'acord, pot configurar el seu navegador per rebutjar les cookies o abandonar el lloc web.`
      },
      {
        title: '7. Actualitzacions d\'aquesta política',
        content: `Podem actualitzar aquesta Política de Cookies periòdicament. Li recomanem que revisi aquesta pàgina regularment per estar informat de qualsevol canvi.`
      }
    ]
  },
  en: {
    title: 'Cookies Policy',
    lastUpdate: 'Last updated: December 2025',
    sections: [
      {
        title: '1. What are cookies?',
        content: `Cookies are small text files that websites store on your device (computer, tablet, mobile) when you visit them. Cookies allow the website to remember your actions and preferences over a period of time, so you don't have to re-enter them every time you visit the site or navigate from one page to another.`
      },
      {
        title: '2. Types of cookies we use',
        content: `• Technical cookies (necessary): These are essential for the website to function. They allow you to navigate the page and use its basic functions. Without these cookies, the website would not work properly.

• Analytical cookies: They help us understand how visitors interact with the website, providing information about areas visited, time spent, and any problems encountered. We use Google Analytics for this purpose.

• Preference cookies: They allow the website to remember your preferences (such as the selected language) to offer you a more personalized experience.`
      },
      {
        title: '3. Third-party cookies',
        content: `This website uses third-party services that may set their own cookies:

• Google Analytics: For web traffic analysis. You can consult their privacy policy at: https://policies.google.com/privacy

• Google Tag Manager: For tag management and tracking.

These third parties may transfer data outside the European Economic Area. You can obtain more information about their privacy policies by visiting their websites.`
      },
      {
        title: '4. Cookie duration',
        content: `• Session cookies: They are automatically deleted when you close your browser.

• Persistent cookies: They remain on your device for a set period or until you manually delete them. Google Analytics analytical cookies have a duration of 2 years.`
      },
      {
        title: '5. Managing cookies',
        content: `You can control and/or delete cookies as you wish. You can delete all cookies already on your device and you can set most browsers to prevent them from being placed.

To manage cookies in the most common browsers:

• Chrome: Settings > Privacy and security > Cookies
• Firefox: Options > Privacy and security
• Safari: Preferences > Privacy
• Edge: Settings > Privacy and services

Please note that if you disable cookies, some website features may not work properly.`
      },
      {
        title: '6. Consent',
        content: `By continuing to browse our website, you accept the use of cookies in accordance with this policy. If you do not agree, you can configure your browser to reject cookies or leave the website.`
      },
      {
        title: '7. Updates to this policy',
        content: `We may update this Cookies Policy periodically. We recommend that you review this page regularly to stay informed of any changes.`
      }
    ]
  },
  fr: {
    title: 'Politique de Cookies',
    lastUpdate: 'Dernière mise à jour: Décembre 2025',
    sections: [
      {
        title: '1. Que sont les cookies?',
        content: `Les cookies sont de petits fichiers texte que les sites web stockent sur votre appareil (ordinateur, tablette, mobile) lorsque vous les visitez. Les cookies permettent au site web de mémoriser vos actions et préférences pendant une période de temps, afin que vous n'ayez pas à les saisir à nouveau chaque fois que vous visitez le site ou naviguez d'une page à l'autre.`
      },
      {
        title: '2. Types de cookies que nous utilisons',
        content: `• Cookies techniques (nécessaires): Ils sont essentiels au fonctionnement du site web. Ils vous permettent de naviguer sur la page et d'utiliser ses fonctions de base.

• Cookies analytiques: Ils nous aident à comprendre comment les visiteurs interagissent avec le site web. Nous utilisons Google Analytics à cette fin.

• Cookies de préférences: Ils permettent au site web de mémoriser vos préférences (comme la langue sélectionnée).`
      },
      {
        title: '3. Cookies tiers',
        content: `Ce site web utilise des services tiers qui peuvent définir leurs propres cookies:

• Google Analytics: Pour l'analyse du trafic web.
• Google Tag Manager: Pour la gestion des balises et le suivi.`
      },
      {
        title: '4. Durée des cookies',
        content: `• Cookies de session: Ils sont automatiquement supprimés lorsque vous fermez votre navigateur.

• Cookies persistants: Ils restent sur votre appareil pendant une période déterminée ou jusqu'à ce que vous les supprimiez manuellement.`
      },
      {
        title: '5. Gestion des cookies',
        content: `Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez. Pour gérer les cookies dans les navigateurs les plus courants, consultez les paramètres de confidentialité de votre navigateur.`
      },
      {
        title: '6. Consentement',
        content: `En continuant à naviguer sur notre site web, vous acceptez l'utilisation de cookies conformément à cette politique.`
      },
      {
        title: '7. Mises à jour de cette politique',
        content: `Nous pouvons mettre à jour cette Politique de Cookies périodiquement. Nous vous recommandons de consulter cette page régulièrement.`
      }
    ]
  },
  de: {
    title: 'Cookie-Richtlinie',
    lastUpdate: 'Letzte Aktualisierung: Dezember 2025',
    sections: [
      {
        title: '1. Was sind Cookies?',
        content: `Cookies sind kleine Textdateien, die Websites auf Ihrem Gerät (Computer, Tablet, Mobiltelefon) speichern, wenn Sie sie besuchen. Cookies ermöglichen es der Website, Ihre Aktionen und Präferenzen über einen bestimmten Zeitraum zu speichern.`
      },
      {
        title: '2. Arten von Cookies, die wir verwenden',
        content: `• Technische Cookies (notwendig): Sie sind für das Funktionieren der Website unerlässlich.

• Analytische Cookies: Sie helfen uns zu verstehen, wie Besucher mit der Website interagieren. Wir verwenden Google Analytics zu diesem Zweck.

• Präferenz-Cookies: Sie ermöglichen es der Website, Ihre Präferenzen zu speichern.`
      },
      {
        title: '3. Cookies von Drittanbietern',
        content: `Diese Website verwendet Dienste von Drittanbietern, die ihre eigenen Cookies setzen können:

• Google Analytics: Für die Analyse des Web-Traffics.
• Google Tag Manager: Für Tag-Management und Tracking.`
      },
      {
        title: '4. Cookie-Dauer',
        content: `• Sitzungs-Cookies: Sie werden automatisch gelöscht, wenn Sie Ihren Browser schließen.

• Dauerhafte Cookies: Sie bleiben auf Ihrem Gerät für einen bestimmten Zeitraum.`
      },
      {
        title: '5. Cookie-Verwaltung',
        content: `Sie können Cookies nach Belieben kontrollieren und/oder löschen. Um Cookies in den gängigsten Browsern zu verwalten, konsultieren Sie die Datenschutzeinstellungen Ihres Browsers.`
      },
      {
        title: '6. Einwilligung',
        content: `Indem Sie weiterhin auf unserer Website surfen, akzeptieren Sie die Verwendung von Cookies gemäß dieser Richtlinie.`
      },
      {
        title: '7. Aktualisierungen dieser Richtlinie',
        content: `Wir können diese Cookie-Richtlinie regelmäßig aktualisieren. Wir empfehlen Ihnen, diese Seite regelmäßig zu überprüfen.`
      }
    ]
  },
  it: {
    title: 'Politica dei Cookie',
    lastUpdate: 'Ultimo aggiornamento: Dicembre 2025',
    sections: [
      {
        title: '1. Cosa sono i cookie?',
        content: `I cookie sono piccoli file di testo che i siti web memorizzano sul tuo dispositivo (computer, tablet, mobile) quando li visiti. I cookie permettono al sito web di ricordare le tue azioni e preferenze per un periodo di tempo.`
      },
      {
        title: '2. Tipi di cookie che utilizziamo',
        content: `• Cookie tecnici (necessari): Sono essenziali per il funzionamento del sito web.

• Cookie analitici: Ci aiutano a capire come i visitatori interagiscono con il sito web. Utilizziamo Google Analytics per questo scopo.

• Cookie di preferenza: Permettono al sito web di ricordare le tue preferenze.`
      },
      {
        title: '3. Cookie di terze parti',
        content: `Questo sito web utilizza servizi di terze parti che possono impostare i propri cookie:

• Google Analytics: Per l'analisi del traffico web.
• Google Tag Manager: Per la gestione dei tag e il tracciamento.`
      },
      {
        title: '4. Durata dei cookie',
        content: `• Cookie di sessione: Vengono automaticamente eliminati quando chiudi il browser.

• Cookie persistenti: Rimangono sul tuo dispositivo per un periodo determinato.`
      },
      {
        title: '5. Gestione dei cookie',
        content: `Puoi controllare e/o eliminare i cookie come desideri. Per gestire i cookie nei browser più comuni, consulta le impostazioni sulla privacy del tuo browser.`
      },
      {
        title: '6. Consenso',
        content: `Continuando a navigare sul nostro sito web, accetti l'uso dei cookie in conformità con questa politica.`
      },
      {
        title: '7. Aggiornamenti di questa politica',
        content: `Potremmo aggiornare periodicamente questa Politica dei Cookie. Ti consigliamo di controllare regolarmente questa pagina.`
      }
    ]
  }
};

const CookiesPolicy: React.FC<CookiesPolicyProps> = ({ lang }) => {
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
            <div className="p-3 bg-amber-100 rounded-xl">
              <Cookie className="text-amber-600" size={28} />
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
            {lang === 'es' ? '¿Tiene preguntas sobre cookies?' : lang === 'ca' ? 'Té preguntes sobre cookies?' : 'Have questions about cookies?'}{' '}
            <a href="mailto:hola@eportsinternet.com" className="text-primary-600 hover:underline">hola@eportsinternet.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicy;
