import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';
import { Language } from '../types';

interface LegalNoticeProps {
  lang: Language;
}

const CONTENT: Record<Language, {
  title: string;
  lastUpdate: string;
  sections: { title: string; content: string }[];
}> = {
  es: {
    title: 'Aviso Legal',
    lastUpdate: 'Última actualización: Diciembre 2025',
    sections: [
      {
        title: '1. Datos Identificativos',
        content: `En cumplimiento del deber de información establecido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos:

• Razón Social: E-PORTS AMPLE DE BANDA I INTERNET, S.L.
• Nombre comercial: EportsTech (parte de Grupo EACOM)
• CIF: B55688410
• Domicilio social: Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, España
• Teléfono: 977 353 735
• Correo electrónico: hola@eportsinternet.com
• Actividad: Servicios de telecomunicaciones y tecnología de la información
• Inscrita en el Registro Mercantil de Tarragona`
      },
      {
        title: '2. Objeto',
        content: `El presente sitio web tiene como objeto facilitar al público en general el conocimiento de las actividades que EportsTech realiza y de los servicios que ofrece. EportsTech se reserva la facultad de efectuar, en cualquier momento y sin necesidad de previo aviso, modificaciones y actualizaciones de la información contenida en su web o en su configuración y presentación.`
      },
      {
        title: '3. Propiedad Intelectual e Industrial',
        content: `Este sitio web y todos sus contenidos, incluyendo pero no limitándose a textos, documentos, fotografías, gráficos, imágenes, iconos, tecnología, software, links y demás contenidos audiovisuales o sonoros, así como su diseño gráfico y códigos fuente, son propiedad de EportsTech o de terceros que han autorizado su uso, y están protegidos por los derechos de propiedad intelectual e industrial.

Queda prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra actividad que se realice con los contenidos de este sitio web sin el consentimiento previo y por escrito de EportsTech.

Las marcas, nombres comerciales o signos distintivos que aparecen en este sitio web son propiedad de EportsTech o de terceros, y no podrán ser utilizados sin autorización expresa.`
      },
      {
        title: '4. Condiciones de Uso',
        content: `El usuario se compromete a utilizar el sitio web y sus servicios de conformidad con la ley, el presente Aviso Legal, las buenas costumbres y el orden público.

El usuario se obliga a:

• No utilizar el sitio web con fines ilícitos o lesivos contra EportsTech o terceros.
• No realizar actividades que puedan dañar, sobrecargar o deteriorar el sitio web.
• No introducir virus u otros elementos que puedan causar daños a los sistemas informáticos.
• No intentar acceder de forma no autorizada a áreas restringidas del sitio web.
• No utilizar los contenidos para fines comerciales sin autorización expresa.`
      },
      {
        title: '5. Exclusión de Responsabilidad',
        content: `EportsTech no garantiza la disponibilidad continua del sitio web ni se hace responsable de los posibles daños o perjuicios causados al usuario debido a:

• Interrupciones, virus informáticos, averías telefónicas o desconexiones en el funcionamiento del sistema electrónico.
• Retrasos o bloqueos en el funcionamiento del sistema causados por deficiencias o sobrecargas en las líneas telefónicas, internet o centros de datos.
• La falta de veracidad, exactitud, exhaustividad y/o actualidad de los contenidos.
• Daños causados por terceros mediante intromisiones ilegítimas fuera del control de EportsTech.

Los enlaces a sitios web de terceros tienen finalidad informativa, y EportsTech no asume responsabilidad por el contenido de dichos sitios ni garantiza su disponibilidad.`
      },
      {
        title: '6. Enlaces Externos',
        content: `Este sitio web puede contener enlaces a páginas web de terceros. EportsTech no asume ninguna responsabilidad por el contenido, veracidad o funcionamiento de dichos sitios web externos. La inclusión de estos enlaces no implica ningún tipo de asociación, fusión o participación con las entidades conectadas.`
      },
      {
        title: '7. Protección de Datos',
        content: `El tratamiento de datos personales se rige por nuestra Política de Privacidad, que constituye parte integrante del presente Aviso Legal. Le recomendamos que la revise para conocer cómo protegemos su información personal.`
      },
      {
        title: '8. Legislación Aplicable y Jurisdicción',
        content: `Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia derivada del uso de este sitio web, las partes se someten expresamente a los Juzgados y Tribunales de Tortosa (Tarragona), con renuncia a cualquier otro fuero que pudiera corresponderles.`
      },
      {
        title: '9. Contacto',
        content: `Para cualquier duda o consulta relacionada con este Aviso Legal, puede ponerse en contacto con nosotros a través de:

• Correo electrónico: hola@eportsinternet.com
• Teléfono: 977 353 735
• Dirección postal: Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, España`
      }
    ]
  },
  ca: {
    title: 'Avís Legal',
    lastUpdate: 'Última actualització: Desembre 2025',
    sections: [
      {
        title: '1. Dades Identificatives',
        content: `En compliment del deure d'informació establert a l'article 10 de la Llei 34/2002, d'11 de juliol, de Serveis de la Societat de la Informació i Comerç Electrònic (LSSI-CE), es faciliten les següents dades:

• Raó Social: E-PORTS AMPLE DE BANDA I INTERNET, S.L.
• Nom comercial: EportsTech (part de Grup EACOM)
• CIF: B55688410
• Domicili social: Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, Espanya
• Telèfon: 977 353 735
• Correu electrònic: hola@eportsinternet.com
• Activitat: Serveis de telecomunicacions i tecnologia de la informació
• Inscrita al Registre Mercantil de Tarragona`
      },
      {
        title: '2. Objecte',
        content: `El present lloc web té com a objecte facilitar al públic en general el coneixement de les activitats que EportsTech realitza i dels serveis que ofereix. EportsTech es reserva la facultat d'efectuar, en qualsevol moment i sense necessitat de previ avís, modificacions i actualitzacions de la informació continguda a la seva web o en la seva configuració i presentació.`
      },
      {
        title: '3. Propietat Intel·lectual i Industrial',
        content: `Aquest lloc web i tots els seus continguts, incloent però no limitant-se a textos, documents, fotografies, gràfics, imatges, icones, tecnologia, software, links i altres continguts audiovisuals o sonors, així com el seu disseny gràfic i codis font, són propietat d'EportsTech o de tercers que han autoritzat el seu ús, i estan protegits pels drets de propietat intel·lectual i industrial.

Queda prohibida la reproducció, distribució, comunicació pública, transformació o qualsevol altra activitat que es realitzi amb els continguts d'aquest lloc web sense el consentiment previ i per escrit d'EportsTech.`
      },
      {
        title: '4. Condicions d\'Ús',
        content: `L'usuari es compromet a utilitzar el lloc web i els seus serveis de conformitat amb la llei, el present Avís Legal, els bons costums i l'ordre públic.

L'usuari s'obliga a:

• No utilitzar el lloc web amb fins il·lícits o lesius contra EportsTech o tercers.
• No realitzar activitats que puguin danyar, sobrecarregar o deteriorar el lloc web.
• No introduir virus o altres elements que puguin causar danys als sistemes informàtics.
• No intentar accedir de forma no autoritzada a àrees restringides del lloc web.`
      },
      {
        title: '5. Exclusió de Responsabilitat',
        content: `EportsTech no garanteix la disponibilitat contínua del lloc web ni es fa responsable dels possibles danys o perjudicis causats a l'usuari degut a:

• Interrupcions, virus informàtics, avaries telefòniques o desconnexions en el funcionament del sistema electrònic.
• Retards o bloquejos en el funcionament del sistema causats per deficiències o sobrecàrregues a les línies telefòniques, internet o centres de dades.
• La manca de veracitat, exactitud, exhaustivitat i/o actualitat dels continguts.`
      },
      {
        title: '6. Enllaços Externs',
        content: `Aquest lloc web pot contenir enllaços a pàgines web de tercers. EportsTech no assumeix cap responsabilitat pel contingut, veracitat o funcionament d'aquests llocs web externs.`
      },
      {
        title: '7. Protecció de Dades',
        content: `El tractament de dades personals es regeix per la nostra Política de Privacitat, que constitueix part integrant del present Avís Legal. Li recomanem que la revisi per conèixer com protegim la seva informació personal.`
      },
      {
        title: '8. Legislació Aplicable i Jurisdicció',
        content: `Les presents condicions es regeixen per la legislació espanyola. Per a la resolució de qualsevol controvèrsia derivada de l'ús d'aquest lloc web, les parts se sotmeten expressament als Jutjats i Tribunals de Tortosa (Tarragona).`
      },
      {
        title: '9. Contacte',
        content: `Per a qualsevol dubte o consulta relacionada amb aquest Avís Legal, pot posar-se en contacte amb nosaltres a través de:

• Correu electrònic: hola@eportsinternet.com
• Telèfon: 977 353 735
• Adreça postal: Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, Espanya`
      }
    ]
  },
  en: {
    title: 'Legal Notice',
    lastUpdate: 'Last updated: December 2025',
    sections: [
      {
        title: '1. Identification Data',
        content: `In compliance with the duty of information established in Article 10 of Law 34/2002, of July 11, on Information Society Services and Electronic Commerce (LSSI-CE), the following data is provided:

• Company name: E-PORTS AMPLE DE BANDA I INTERNET, S.L.
• Trade name: EportsTech (part of Grupo EACOM)
• Tax ID (CIF): B55688410
• Registered office: Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, Spain
• Phone: +34 977 353 735
• Email: hola@eportsinternet.com
• Activity: Telecommunications and information technology services
• Registered in the Commercial Registry of Tarragona`
      },
      {
        title: '2. Purpose',
        content: `This website aims to provide the general public with knowledge of the activities carried out by EportsTech and the services it offers. EportsTech reserves the right to make modifications and updates to the information contained on its website at any time and without prior notice.`
      },
      {
        title: '3. Intellectual and Industrial Property',
        content: `This website and all its contents, including but not limited to texts, documents, photographs, graphics, images, icons, technology, software, links and other audiovisual or sound content, as well as its graphic design and source codes, are the property of EportsTech or third parties who have authorized their use, and are protected by intellectual and industrial property rights.

The reproduction, distribution, public communication, transformation or any other activity carried out with the contents of this website without the prior written consent of EportsTech is prohibited.`
      },
      {
        title: '4. Terms of Use',
        content: `The user agrees to use the website and its services in accordance with the law, this Legal Notice, good customs and public order.

The user agrees to:

• Not use the website for illegal purposes or harmful to EportsTech or third parties.
• Not carry out activities that may damage, overload or deteriorate the website.
• Not introduce viruses or other elements that may cause damage to computer systems.
• Not attempt unauthorized access to restricted areas of the website.`
      },
      {
        title: '5. Disclaimer',
        content: `EportsTech does not guarantee the continuous availability of the website and is not responsible for possible damages caused to the user due to:

• Interruptions, computer viruses, telephone failures or disconnections in the operation of the electronic system.
• Delays or blockages in system operation caused by deficiencies or overloads in telephone lines, internet or data centers.
• Lack of truthfulness, accuracy, completeness and/or timeliness of the contents.`
      },
      {
        title: '6. External Links',
        content: `This website may contain links to third-party websites. EportsTech assumes no responsibility for the content, veracity or operation of such external websites.`
      },
      {
        title: '7. Data Protection',
        content: `The processing of personal data is governed by our Privacy Policy, which constitutes an integral part of this Legal Notice. We recommend that you review it to learn how we protect your personal information.`
      },
      {
        title: '8. Applicable Law and Jurisdiction',
        content: `These conditions are governed by Spanish law. For the resolution of any dispute arising from the use of this website, the parties expressly submit to the Courts and Tribunals of Tortosa (Tarragona).`
      },
      {
        title: '9. Contact',
        content: `For any questions or inquiries related to this Legal Notice, you can contact us through:

• Email: info@eportstech.com
• Postal address: Tortosa, Tarragona, Spain`
      }
    ]
  },
  fr: {
    title: 'Mentions Légales',
    lastUpdate: 'Dernière mise à jour: Décembre 2025',
    sections: [
      {
        title: '1. Données d\'Identification',
        content: `• Raison sociale: E-PORTS AMPLE DE BANDA I INTERNET, S.L.
• Nom commercial: EportsTech (partie de Grupo EACOM)
• N° d'identification fiscale (CIF): B55688410
• Siège social: Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragone, Espagne
• Téléphone: +34 977 353 735
• E-mail: hola@eportsinternet.com
• Activité: Services de télécommunications et technologies de l'information`
      },
      {
        title: '2. Objet',
        content: `Ce site web a pour objet de faire connaître au public les activités réalisées par EportsTech et les services qu'elle offre.`
      },
      {
        title: '3. Propriété Intellectuelle et Industrielle',
        content: `Ce site web et tous ses contenus sont la propriété d'EportsTech ou de tiers ayant autorisé leur utilisation, et sont protégés par les droits de propriété intellectuelle et industrielle. La reproduction, distribution ou toute autre utilisation sans consentement écrit préalable est interdite.`
      },
      {
        title: '4. Conditions d\'Utilisation',
        content: `L'utilisateur s'engage à utiliser le site web conformément à la loi, aux présentes mentions légales et à l'ordre public.`
      },
      {
        title: '5. Exclusion de Responsabilité',
        content: `EportsTech ne garantit pas la disponibilité continue du site web et n'est pas responsable des dommages causés par des interruptions, virus ou pannes.`
      },
      {
        title: '6. Liens Externes',
        content: `Ce site web peut contenir des liens vers des sites web tiers. EportsTech n'assume aucune responsabilité pour leur contenu.`
      },
      {
        title: '7. Protection des Données',
        content: `Le traitement des données personnelles est régi par notre Politique de Confidentialité.`
      },
      {
        title: '8. Loi Applicable et Juridiction',
        content: `Ces conditions sont régies par la législation espagnole. Les tribunaux de Tortosa (Tarragone) sont compétents pour résoudre tout litige.`
      },
      {
        title: '9. Contact',
        content: `Pour toute question: info@eportstech.com`
      }
    ]
  },
  de: {
    title: 'Impressum',
    lastUpdate: 'Letzte Aktualisierung: Dezember 2025',
    sections: [
      {
        title: '1. Identifikationsdaten',
        content: `• Firmenname: E-PORTS AMPLE DE BANDA I INTERNET, S.L.
• Handelsname: EportsTech (Teil der Grupo EACOM)
• Steuernummer (CIF): B55688410
• Sitz: Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, Spanien
• Telefon: +34 977 353 735
• E-Mail: hola@eportsinternet.com
• Tätigkeit: Telekommunikations- und IT-Dienstleistungen`
      },
      {
        title: '2. Zweck',
        content: `Diese Website dient dazu, die Öffentlichkeit über die Aktivitäten und Dienstleistungen von EportsTech zu informieren.`
      },
      {
        title: '3. Geistiges und gewerbliches Eigentum',
        content: `Diese Website und alle ihre Inhalte sind Eigentum von EportsTech oder Dritten und durch Rechte an geistigem und gewerblichem Eigentum geschützt.`
      },
      {
        title: '4. Nutzungsbedingungen',
        content: `Der Nutzer verpflichtet sich, die Website in Übereinstimmung mit dem Gesetz und dieser Rechtshinweise zu nutzen.`
      },
      {
        title: '5. Haftungsausschluss',
        content: `EportsTech garantiert nicht die kontinuierliche Verfügbarkeit der Website und haftet nicht für Schäden durch Unterbrechungen, Viren oder Ausfälle.`
      },
      {
        title: '6. Externe Links',
        content: `Diese Website kann Links zu Websites Dritter enthalten. EportsTech übernimmt keine Verantwortung für deren Inhalte.`
      },
      {
        title: '7. Datenschutz',
        content: `Die Verarbeitung personenbezogener Daten unterliegt unserer Datenschutzrichtlinie.`
      },
      {
        title: '8. Anwendbares Recht und Gerichtsstand',
        content: `Diese Bedingungen unterliegen spanischem Recht. Gerichtsstand ist Tortosa (Tarragona).`
      },
      {
        title: '9. Kontakt',
        content: `Bei Fragen: info@eportstech.com`
      }
    ]
  },
  it: {
    title: 'Avviso Legale',
    lastUpdate: 'Ultimo aggiornamento: Dicembre 2025',
    sections: [
      {
        title: '1. Dati Identificativi',
        content: `• Ragione sociale: E-PORTS AMPLE DE BANDA I INTERNET, S.L.
• Nome commerciale: EportsTech (parte di Grupo EACOM)
• Partita IVA (CIF): B55688410
• Sede legale: Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, Spagna
• Telefono: +34 977 353 735
• E-mail: hola@eportsinternet.com
• Attività: Servizi di telecomunicazioni e tecnologie dell'informazione`
      },
      {
        title: '2. Oggetto',
        content: `Questo sito web ha lo scopo di far conoscere al pubblico le attività svolte da EportsTech e i servizi offerti.`
      },
      {
        title: '3. Proprietà Intellettuale e Industriale',
        content: `Questo sito web e tutti i suoi contenuti sono di proprietà di EportsTech o di terzi e sono protetti dai diritti di proprietà intellettuale e industriale.`
      },
      {
        title: '4. Condizioni d\'Uso',
        content: `L'utente si impegna a utilizzare il sito web in conformità con la legge e il presente Avviso Legale.`
      },
      {
        title: '5. Esclusione di Responsabilità',
        content: `EportsTech non garantisce la disponibilità continua del sito web e non è responsabile per danni causati da interruzioni, virus o guasti.`
      },
      {
        title: '6. Link Esterni',
        content: `Questo sito web può contenere link a siti web di terzi. EportsTech non si assume alcuna responsabilità per i loro contenuti.`
      },
      {
        title: '7. Protezione dei Dati',
        content: `Il trattamento dei dati personali è regolato dalla nostra Politica sulla Privacy.`
      },
      {
        title: '8. Legge Applicabile e Giurisdizione',
        content: `Queste condizioni sono regolate dalla legge spagnola. Competenti sono i tribunali di Tortosa (Tarragona).`
      },
      {
        title: '9. Contatto',
        content: `Per domande: info@eportstech.com`
      }
    ]
  }
};

const LegalNotice: React.FC<LegalNoticeProps> = ({ lang }) => {
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
            <div className="p-3 bg-blue-100 rounded-xl">
              <Scale className="text-blue-600" size={28} />
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
            {lang === 'es' ? '¿Tiene preguntas legales?' : lang === 'ca' ? 'Té preguntes legals?' : 'Have legal questions?'}{' '}
            <a href="mailto:hola@eportsinternet.com" className="text-primary-600 hover:underline">hola@eportsinternet.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
