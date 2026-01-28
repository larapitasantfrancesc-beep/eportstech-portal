import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, Loader2 } from 'lucide-react';
import { Language } from '../types';
import { getLegalText, LegalText } from '../services/supabaseMock';

interface LegalNoticeProps {
  lang: Language;
}

// Contingut per defecte (el que ja teníeu)
const DEFAULT_CONTENT: Record<Language, string> = {
  es: `<h2>1. Datos Identificativos</h2>
<p>En cumplimiento del deber de información establecido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos:</p>
<ul>
<li><strong>Razón Social:</strong> E-PORTS AMPLE DE BANDA I INTERNET, S.L.</li>
<li><strong>Nombre comercial:</strong> EportsTech (parte de Grupo EACOM)</li>
<li><strong>CIF:</strong> B55688410</li>
<li><strong>Domicilio social:</strong> Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, España</li>
<li><strong>Teléfono:</strong> 977 353 735</li>
<li><strong>Correo electrónico:</strong> hola@eportsinternet.com</li>
<li><strong>Actividad:</strong> Servicios de telecomunicaciones y tecnología de la información</li>
<li>Inscrita en el Registro Mercantil de Tarragona</li>
</ul>

<h2>2. Objeto</h2>
<p>El presente sitio web tiene como objeto facilitar al público en general el conocimiento de las actividades que EportsTech realiza y de los servicios que ofrece. EportsTech se reserva la facultad de efectuar, en cualquier momento y sin necesidad de previo aviso, modificaciones y actualizaciones de la información contenida en su web o en su configuración y presentación.</p>

<h2>3. Propiedad Intelectual e Industrial</h2>
<p>Este sitio web y todos sus contenidos, incluyendo pero no limitándose a textos, documentos, fotografías, gráficos, imágenes, iconos, tecnología, software, links y demás contenidos audiovisuales o sonoros, así como su diseño gráfico y códigos fuente, son propiedad de EportsTech o de terceros que han autorizado su uso, y están protegidos por los derechos de propiedad intelectual e industrial.</p>
<p>Queda prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra actividad que se realice con los contenidos de este sitio web sin el consentimiento previo y por escrito de EportsTech.</p>
<p>Las marcas, nombres comerciales o signos distintivos que aparecen en este sitio web son propiedad de EportsTech o de terceros, y no podrán ser utilizados sin autorización expresa.</p>

<h2>4. Condiciones de Uso</h2>
<p>El usuario se compromete a utilizar el sitio web y sus servicios de conformidad con la ley, el presente Aviso Legal, las buenas costumbres y el orden público.</p>
<p>El usuario se obliga a:</p>
<ul>
<li>No utilizar el sitio web con fines ilícitos o lesivos contra EportsTech o terceros.</li>
<li>No realizar actividades que puedan dañar, sobrecargar o deteriorar el sitio web.</li>
<li>No introducir virus u otros elementos que puedan causar daños a los sistemas informáticos.</li>
<li>No intentar acceder de forma no autorizada a áreas restringidas del sitio web.</li>
<li>No utilizar los contenidos para fines comerciales sin autorización expresa.</li>
</ul>

<h2>5. Exclusión de Responsabilidad</h2>
<p>EportsTech no garantiza la disponibilidad continua del sitio web ni se hace responsable de los posibles daños o perjuicios causados al usuario debido a:</p>
<ul>
<li>Interrupciones, virus informáticos, averías telefónicas o desconexiones en el funcionamiento del sistema electrónico.</li>
<li>Retrasos o bloqueos en el funcionamiento del sistema causados por deficiencias o sobrecargas en las líneas telefónicas, internet o centros de datos.</li>
<li>La falta de veracidad, exactitud, exhaustividad y/o actualidad de los contenidos.</li>
<li>Daños causados por terceros mediante intromisiones ilegítimas fuera del control de EportsTech.</li>
</ul>
<p>Los enlaces a sitios web de terceros tienen finalidad informativa, y EportsTech no asume responsabilidad por el contenido de dichos sitios ni garantiza su disponibilidad.</p>

<h2>6. Enlaces Externos</h2>
<p>Este sitio web puede contener enlaces a páginas web de terceros. EportsTech no asume ninguna responsabilidad por el contenido, veracidad o funcionamiento de dichos sitios web externos. La inclusión de estos enlaces no implica ningún tipo de asociación, fusión o participación con las entidades conectadas.</p>

<h2>7. Protección de Datos</h2>
<p>El tratamiento de datos personales se rige por nuestra Política de Privacidad, que constituye parte integrante del presente Aviso Legal. Le recomendamos que la revise para conocer cómo protegemos su información personal.</p>

<h2>8. Legislación Aplicable y Jurisdicción</h2>
<p>Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia derivada del uso de este sitio web, las partes se someten expresamente a los Juzgados y Tribunales de Tortosa (Tarragona), con renuncia a cualquier otro fuero que pudiera corresponderles.</p>

<h2>9. Contacto</h2>
<p>Para cualquier duda o consulta relacionada con este Aviso Legal, puede ponerse en contacto con nosotros a través de:</p>
<ul>
<li><strong>Correo electrónico:</strong> hola@eportsinternet.com</li>
<li><strong>Teléfono:</strong> 977 353 735</li>
<li><strong>Dirección postal:</strong> Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, España</li>
</ul>`,

  ca: `<h2>1. Dades Identificatives</h2>
<p>En compliment del deure d'informació establert a l'article 10 de la Llei 34/2002, d'11 de juliol, de Serveis de la Societat de la Informació i Comerç Electrònic (LSSI-CE), es faciliten les següents dades:</p>
<ul>
<li><strong>Raó Social:</strong> E-PORTS AMPLE DE BANDA I INTERNET, S.L.</li>
<li><strong>Nom comercial:</strong> EportsTech (part de Grup EACOM)</li>
<li><strong>CIF:</strong> B55688410</li>
<li><strong>Domicili social:</strong> Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, Espanya</li>
<li><strong>Telèfon:</strong> 977 353 735</li>
<li><strong>Correu electrònic:</strong> hola@eportsinternet.com</li>
<li><strong>Activitat:</strong> Serveis de telecomunicacions i tecnologia de la informació</li>
<li>Inscrita al Registre Mercantil de Tarragona</li>
</ul>

<h2>2. Objecte</h2>
<p>El present lloc web té com a objecte facilitar al públic en general el coneixement de les activitats que EportsTech realitza i dels serveis que ofereix. EportsTech es reserva la facultat d'efectuar, en qualsevol moment i sense necessitat de previ avís, modificacions i actualitzacions de la informació continguda a la seva web o en la seva configuració i presentació.</p>

<h2>3. Propietat Intel·lectual i Industrial</h2>
<p>Aquest lloc web i tots els seus continguts, incloent però no limitant-se a textos, documents, fotografies, gràfics, imatges, icones, tecnologia, software, links i altres continguts audiovisuals o sonors, així com el seu disseny gràfic i codis font, són propietat d'EportsTech o de tercers que han autoritzat el seu ús, i estan protegits pels drets de propietat intel·lectual i industrial.</p>
<p>Queda prohibida la reproducció, distribució, comunicació pública, transformació o qualsevol altra activitat que es realitzi amb els continguts d'aquest lloc web sense el consentiment previ i per escrit d'EportsTech.</p>

<h2>4. Condicions d'Ús</h2>
<p>L'usuari es compromet a utilitzar el lloc web i els seus serveis de conformitat amb la llei, el present Avís Legal, els bons costums i l'ordre públic.</p>
<p>L'usuari s'obliga a:</p>
<ul>
<li>No utilitzar el lloc web amb fins il·lícits o lesius contra EportsTech o tercers.</li>
<li>No realitzar activitats que puguin danyar, sobrecarregar o deteriorar el lloc web.</li>
<li>No introduir virus o altres elements que puguin causar danys als sistemes informàtics.</li>
<li>No intentar accedir de forma no autoritzada a àrees restringides del lloc web.</li>
</ul>

<h2>5. Exclusió de Responsabilitat</h2>
<p>EportsTech no garanteix la disponibilitat contínua del lloc web ni es fa responsable dels possibles danys o perjudicis causats a l'usuari degut a:</p>
<ul>
<li>Interrupcions, virus informàtics, avaries telefòniques o desconnexions en el funcionament del sistema electrònic.</li>
<li>Retards o bloquejos en el funcionament del sistema causats per deficiències o sobrecàrregues a les línies telefòniques, internet o centres de dades.</li>
<li>La manca de veracitat, exactitud, exhaustivitat i/o actualitat dels continguts.</li>
</ul>

<h2>6. Enllaços Externs</h2>
<p>Aquest lloc web pot contenir enllaços a pàgines web de tercers. EportsTech no assumeix cap responsabilitat pel contingut, veracitat o funcionament d'aquests llocs web externs.</p>

<h2>7. Protecció de Dades</h2>
<p>El tractament de dades personals es regeix per la nostra Política de Privacitat, que constitueix part integrant del present Avís Legal. Li recomanem que la revisi per conèixer com protegim la seva informació personal.</p>

<h2>8. Legislació Aplicable i Jurisdicció</h2>
<p>Les presents condicions es regeixen per la legislació espanyola. Per a la resolució de qualsevol controvèrsia derivada de l'ús d'aquest lloc web, les parts se sotmeten expressament als Jutjats i Tribunals de Tortosa (Tarragona).</p>

<h2>9. Contacte</h2>
<p>Per a qualsevol dubte o consulta relacionada amb aquest Avís Legal, pot posar-se en contacte amb nosaltres a través de:</p>
<ul>
<li><strong>Correu electrònic:</strong> hola@eportsinternet.com</li>
<li><strong>Telèfon:</strong> 977 353 735</li>
<li><strong>Adreça postal:</strong> Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, Espanya</li>
</ul>`,

  en: `<h2>1. Identification Data</h2>
<p>In compliance with the information duty established in Article 10 of Law 34/2002, of July 11, on Information Society Services and Electronic Commerce (LSSI-CE), the following data is provided:</p>
<ul>
<li><strong>Company Name:</strong> E-PORTS AMPLE DE BANDA I INTERNET, S.L.</li>
<li><strong>Trade Name:</strong> EportsTech (part of Grupo EACOM)</li>
<li><strong>Tax ID (CIF):</strong> B55688410</li>
<li><strong>Registered Office:</strong> Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, Spain</li>
<li><strong>Phone:</strong> +34 977 353 735</li>
<li><strong>Email:</strong> hola@eportsinternet.com</li>
<li><strong>Activity:</strong> Telecommunications and information technology services</li>
<li>Registered in the Commercial Registry of Tarragona</li>
</ul>

<h2>2. Purpose</h2>
<p>This website aims to provide the general public with knowledge of the activities that EportsTech performs and the services it offers. EportsTech reserves the right to make modifications and updates to the information contained on its website at any time and without prior notice.</p>

<h2>3. Intellectual and Industrial Property</h2>
<p>This website and all its contents, including but not limited to texts, documents, photographs, graphics, images, icons, technology, software, links and other audiovisual or sound content, as well as its graphic design and source codes, are the property of EportsTech or third parties who have authorized their use, and are protected by intellectual and industrial property rights.</p>
<p>The reproduction, distribution, public communication, transformation or any other activity carried out with the contents of this website without the prior written consent of EportsTech is prohibited.</p>

<h2>4. Terms of Use</h2>
<p>The user agrees to use the website and its services in accordance with the law, this Legal Notice, good customs and public order.</p>
<p>The user agrees to:</p>
<ul>
<li>Not use the website for illegal purposes or harmful to EportsTech or third parties.</li>
<li>Not carry out activities that may damage, overload or deteriorate the website.</li>
<li>Not introduce viruses or other elements that may cause damage to computer systems.</li>
<li>Not attempt unauthorized access to restricted areas of the website.</li>
</ul>

<h2>5. Disclaimer</h2>
<p>EportsTech does not guarantee the continuous availability of the website and is not responsible for any damages caused to the user due to interruptions, computer viruses, telephone failures or disconnections.</p>

<h2>6. External Links</h2>
<p>This website may contain links to third-party websites. EportsTech assumes no responsibility for the content, accuracy or operation of such external websites.</p>

<h2>7. Data Protection</h2>
<p>The processing of personal data is governed by our Privacy Policy, which forms an integral part of this Legal Notice.</p>

<h2>8. Applicable Law and Jurisdiction</h2>
<p>These conditions are governed by Spanish law. For the resolution of any dispute arising from the use of this website, the parties expressly submit to the Courts of Tortosa (Tarragona).</p>

<h2>9. Contact</h2>
<p>For any questions related to this Legal Notice, you can contact us through:</p>
<ul>
<li><strong>Email:</strong> hola@eportsinternet.com</li>
<li><strong>Phone:</strong> +34 977 353 735</li>
<li><strong>Postal address:</strong> Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, Spain</li>
</ul>`,

  fr: `<h2>1. Données d'identification</h2>
<ul>
<li><strong>Raison sociale:</strong> E-PORTS AMPLE DE BANDA I INTERNET, S.L.</li>
<li><strong>Nom commercial:</strong> EportsTech (partie de Grupo EACOM)</li>
<li><strong>NIF:</strong> B55688410</li>
<li><strong>Siège social:</strong> Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragone, Espagne</li>
<li><strong>Téléphone:</strong> +34 977 353 735</li>
<li><strong>Email:</strong> hola@eportsinternet.com</li>
</ul>

<h2>2. Objet</h2>
<p>Ce site web a pour objet de faire connaître au public les activités d'EportsTech et les services qu'elle propose.</p>

<h2>3. Propriété intellectuelle et industrielle</h2>
<p>Ce site web et tous ses contenus sont la propriété d'EportsTech et sont protégés par les droits de propriété intellectuelle et industrielle.</p>

<h2>4. Conditions d'utilisation</h2>
<p>L'utilisateur s'engage à utiliser le site web conformément à la loi et au présent avis légal.</p>

<h2>5. Exclusion de responsabilité</h2>
<p>EportsTech ne garantit pas la disponibilité continue du site web.</p>

<h2>6. Liens externes</h2>
<p>Ce site web peut contenir des liens vers des sites web tiers. EportsTech n'assume aucune responsabilité pour leur contenu.</p>

<h2>7. Protection des données</h2>
<p>Le traitement des données personnelles est régi par notre Politique de Confidentialité.</p>

<h2>8. Loi applicable et juridiction</h2>
<p>Ces conditions sont régies par la loi espagnole. Compétence: Tribunaux de Tortosa (Tarragone).</p>

<h2>9. Contact</h2>
<p>Pour toute question: hola@eportsinternet.com</p>`,

  de: `<h2>1. Identifikationsdaten</h2>
<ul>
<li><strong>Firmenname:</strong> E-PORTS AMPLE DE BANDA I INTERNET, S.L.</li>
<li><strong>Handelsname:</strong> EportsTech (Teil der Grupo EACOM)</li>
<li><strong>Steuernummer (CIF):</strong> B55688410</li>
<li><strong>Sitz:</strong> Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, Spanien</li>
<li><strong>Telefon:</strong> +34 977 353 735</li>
<li><strong>E-Mail:</strong> hola@eportsinternet.com</li>
</ul>

<h2>2. Zweck</h2>
<p>Diese Website dient dazu, die Öffentlichkeit über die Aktivitäten und Dienstleistungen von EportsTech zu informieren.</p>

<h2>3. Geistiges und gewerbliches Eigentum</h2>
<p>Diese Website und alle ihre Inhalte sind Eigentum von EportsTech und durch Rechte an geistigem und gewerblichem Eigentum geschützt.</p>

<h2>4. Nutzungsbedingungen</h2>
<p>Der Nutzer verpflichtet sich, die Website in Übereinstimmung mit dem Gesetz und diesem Rechtshinweis zu nutzen.</p>

<h2>5. Haftungsausschluss</h2>
<p>EportsTech garantiert nicht die kontinuierliche Verfügbarkeit der Website.</p>

<h2>6. Externe Links</h2>
<p>Diese Website kann Links zu Websites Dritter enthalten. EportsTech übernimmt keine Verantwortung für deren Inhalte.</p>

<h2>7. Datenschutz</h2>
<p>Die Verarbeitung personenbezogener Daten unterliegt unserer Datenschutzrichtlinie.</p>

<h2>8. Anwendbares Recht und Gerichtsstand</h2>
<p>Diese Bedingungen unterliegen spanischem Recht. Gerichtsstand: Tortosa (Tarragona).</p>

<h2>9. Kontakt</h2>
<p>Bei Fragen: hola@eportsinternet.com</p>`,

  it: `<h2>1. Dati Identificativi</h2>
<ul>
<li><strong>Ragione sociale:</strong> E-PORTS AMPLE DE BANDA I INTERNET, S.L.</li>
<li><strong>Nome commerciale:</strong> EportsTech (parte di Grupo EACOM)</li>
<li><strong>Partita IVA (CIF):</strong> B55688410</li>
<li><strong>Sede legale:</strong> Pl. d'Alfons XII, 7, 43500 Tortosa, Tarragona, Spagna</li>
<li><strong>Telefono:</strong> +34 977 353 735</li>
<li><strong>E-mail:</strong> hola@eportsinternet.com</li>
</ul>

<h2>2. Oggetto</h2>
<p>Questo sito web ha lo scopo di far conoscere al pubblico le attività svolte da EportsTech e i servizi offerti.</p>

<h2>3. Proprietà Intellettuale e Industriale</h2>
<p>Questo sito web e tutti i suoi contenuti sono di proprietà di EportsTech e sono protetti dai diritti di proprietà intellettuale e industriale.</p>

<h2>4. Condizioni d'Uso</h2>
<p>L'utente si impegna a utilizzare il sito web in conformità con la legge e il presente Avviso Legale.</p>

<h2>5. Esclusione di Responsabilità</h2>
<p>EportsTech non garantisce la disponibilità continua del sito web.</p>

<h2>6. Link Esterni</h2>
<p>Questo sito web può contenere link a siti web di terzi. EportsTech non si assume alcuna responsabilità per i loro contenuti.</p>

<h2>7. Protezione dei Dati</h2>
<p>Il trattamento dei dati personali è regolato dalla nostra Politica sulla Privacy.</p>

<h2>8. Legge Applicabile e Giurisdizione</h2>
<p>Queste condizioni sono regolate dalla legge spagnola. Competenti: Tribunali di Tortosa (Tarragona).</p>

<h2>9. Contatto</h2>
<p>Per domande: hola@eportsinternet.com</p>`
};

const DEFAULT_TITLES: Record<Language, string> = {
  es: 'Aviso Legal',
  ca: 'Avís Legal',
  en: 'Legal Notice',
  fr: 'Mentions Légales',
  de: 'Impressum',
  it: 'Avviso Legale'
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
  es: '¿Tiene preguntas legales?',
  ca: 'Té preguntes legals?',
  en: 'Have legal questions?',
  fr: 'Des questions juridiques?',
  de: 'Rechtliche Fragen?',
  it: 'Domande legali?'
};

const LegalNotice: React.FC<LegalNoticeProps> = ({ lang }) => {
  const [legalText, setLegalText] = useState<LegalText | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const data = await getLegalText('legal');
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
            <div className="p-3 bg-blue-100 rounded-xl">
              <Scale className="text-blue-600" size={28} />
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

export default LegalNotice;
