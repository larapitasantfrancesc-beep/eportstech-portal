import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Facebook,
  FileDown,
  Send,
  Check,
  Loader2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { Language } from '../types';
import { submitCatalogLead, getSocialMediaConfig, SocialMediaConfig } from '../services/supabaseMock';
import { useUtmTracking } from '../hooks/useUtmTracking';

interface FooterProps {
  lang: Language;
  brandConfig: {
    footerLogo?: string;
    contactEmail?: string;
    contactPhone?: string;
    socialMedia?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
      youtube?: string;
    };
    catalogUrl?: string;
    footer?: {
      privacyText?: Record<Language, string>;
      legalText?: Record<Language, string>;
      cookiesText?: Record<Language, string>;
      copyrightText?: Record<Language, string>;
      aboutText?: Record<Language, string>;
      contactAddress?: Record<Language, string>;
    };
  };
}

// Traduccions
const TEXTS: Record<string, Record<Language, string>> = {
  aboutTitle: {
    es: 'Sobre Nosotros',
    ca: 'Sobre Nosaltres',
    en: 'About Us',
    fr: 'À Propos',
    de: 'Über Uns',
    it: 'Chi Siamo'
  },
  aboutText: {
    es: 'EportsTech es la división empresarial de Grupo EACOM, especializada en soluciones de telecomunicaciones y servicios IT para empresas en España y Europa.',
    ca: 'EportsTech és la divisió empresarial de Grup EACOM, especialitzada en solucions de telecomunicacions i serveis IT per a empreses a Espanya i Europa.',
    en: 'EportsTech is the business division of Grupo EACOM, specialized in telecommunications solutions and IT services for companies in Spain and Europe.',
    fr: 'EportsTech est la division entreprise du Grupo EACOM, spécialisée dans les solutions de télécommunications et services IT.',
    de: 'EportsTech ist die Geschäftsabteilung der Grupo EACOM, spezialisiert auf Telekommunikationslösungen und IT-Services.',
    it: 'EportsTech è la divisione aziendale di Grupo EACOM, specializzata in soluzioni di telecomunicazioni e servizi IT.'
  },
  servicesTitle: {
    es: 'Servicios',
    ca: 'Serveis',
    en: 'Services',
    fr: 'Services',
    de: 'Dienste',
    it: 'Servizi'
  },
  service1: {
    es: 'Fibra Óptica Empresarial',
    ca: 'Fibra Òptica Empresarial',
    en: 'Business Fiber Optic',
    fr: 'Fibre Optique Pro',
    de: 'Business Glasfaser',
    it: 'Fibra Ottica Business'
  },
  service2: {
    es: 'Ciberseguridad',
    ca: 'Ciberseguretat',
    en: 'Cybersecurity',
    fr: 'Cybersécurité',
    de: 'Cybersicherheit',
    it: 'Sicurezza Informatica'
  },
  service3: {
    es: 'Telefonía VoIP',
    ca: 'Telefonia VoIP',
    en: 'VoIP Telephony',
    fr: 'Téléphonie VoIP',
    de: 'VoIP-Telefonie',
    it: 'Telefonia VoIP'
  },
  service4: {
    es: 'Consultoría IT',
    ca: 'Consultoria IT',
    en: 'IT Consulting',
    fr: 'Conseil IT',
    de: 'IT-Beratung',
    it: 'Consulenza IT'
  },
  contactTitle: {
    es: 'Contacto',
    ca: 'Contacte',
    en: 'Contact',
    fr: 'Contact',
    de: 'Kontakt',
    it: 'Contatto'
  },
  address: {
    es: 'Pl. d\'Alfons XII, 7, 43500 Tortosa, Tarragona',
    ca: 'Pl. d\'Alfons XII, 7, 43500 Tortosa, Tarragona',
    en: 'Pl. d\'Alfons XII, 7, 43500 Tortosa, Tarragona, Spain',
    fr: 'Pl. d\'Alfons XII, 7, 43500 Tortosa, Tarragone, Espagne',
    de: 'Pl. d\'Alfons XII, 7, 43500 Tortosa, Tarragona, Spanien',
    it: 'Pl. d\'Alfons XII, 7, 43500 Tortosa, Tarragona, Spagna'
  },
  catalogTitle: {
    es: 'Descarga nuestro catálogo',
    ca: 'Descarrega el nostre catàleg',
    en: 'Download our catalog',
    fr: 'Téléchargez notre catalogue',
    de: 'Laden Sie unseren Katalog herunter',
    it: 'Scarica il nostro catalogo'
  },
  catalogDesc: {
    es: 'Conoce todos nuestros servicios y soluciones empresariales',
    ca: 'Coneix tots els nostres serveis i solucions empresarials',
    en: 'Discover all our services and business solutions',
    fr: 'Découvrez tous nos services et solutions',
    de: 'Entdecken Sie alle unsere Dienstleistungen',
    it: 'Scopri tutti i nostri servizi e soluzioni'
  },
  emailPlaceholder: {
    es: 'Tu email corporativo',
    ca: 'El teu email corporatiu',
    en: 'Your business email',
    fr: 'Votre email professionnel',
    de: 'Ihre geschäftliche E-Mail',
    it: 'La tua email aziendale'
  },
  downloadBtn: {
    es: 'Descargar PDF',
    ca: 'Descarregar PDF',
    en: 'Download PDF',
    fr: 'Télécharger PDF',
    de: 'PDF herunterladen',
    it: 'Scarica PDF'
  },
  downloading: {
    es: 'Enviando...',
    ca: 'Enviant...',
    en: 'Sending...',
    fr: 'Envoi...',
    de: 'Senden...',
    it: 'Invio...'
  },
  downloadSuccess: {
    es: '¡Descarga iniciada!',
    ca: 'Descàrrega iniciada!',
    en: 'Download started!',
    fr: 'Téléchargement commencé!',
    de: 'Download gestartet!',
    it: 'Download avviato!'
  },
  followUs: {
    es: 'Síguenos',
    ca: 'Segueix-nos',
    en: 'Follow Us',
    fr: 'Suivez-nous',
    de: 'Folgen Sie uns',
    it: 'Seguici'
  },
  residentialLink: {
    es: 'Eports Residencial',
    ca: 'Eports Residencial',
    en: 'Eports Residential',
    fr: 'Eports Résidentiel',
    de: 'Eports Privat',
    it: 'Eports Residenziale'
  },
  allRightsReserved: {
    es: 'Todos los derechos reservados.',
    ca: 'Tots els drets reservats.',
    en: 'All rights reserved.',
    fr: 'Tous droits réservés.',
    de: 'Alle Rechte vorbehalten.',
    it: 'Tutti i diritti riservati.'
  }
};

const Footer: React.FC<FooterProps> = ({ lang, brandConfig }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Hook per capturar UTMs de Google Ads i altres fonts
  const { getUtmData } = useUtmTracking();

  const footerLogo = brandConfig.footerLogo || "/logo-white.png";
  const contactEmail = brandConfig.contactEmail || "hola@eportsinternet.com";
  const contactPhone = brandConfig.contactPhone || "977 353 735";
  const privacyText = brandConfig.footer?.privacyText?.[lang] || "Privacidad";
  const legalText = brandConfig.footer?.legalText?.[lang] || "Aviso Legal";
  const cookiesText = brandConfig.footer?.cookiesText?.[lang] || "Cookies";
  const copyrightText = brandConfig.footer?.copyrightText?.[lang] || `© ${new Date().getFullYear()} EportsTech`;
  
  // Textos editables del footer
  const aboutText = brandConfig.footer?.aboutText?.[lang] || TEXTS.aboutText[lang];
  const contactAddress = brandConfig.footer?.contactAddress?.[lang] || "Polígon Industrial, Tortosa";
  
  // Social Media
  const socialMedia = brandConfig.socialMedia || {};
  const catalogUrl = brandConfig.catalogUrl || 'https://drive.google.com/uc?export=download&id=1vweh1bRKZO7lpRudkzjoXDxzxc-s-SGm';
  const hasSocialLinks = socialMedia.linkedin || socialMedia.twitter || socialMedia.facebook || socialMedia.instagram || socialMedia.youtube;

  const handleCatalogDownload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError(lang === 'es' ? 'Introduce un email válido' : lang === 'ca' ? 'Introdueix un email vàlid' : 'Enter a valid email');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Obrir la finestra ABANS del await per evitar bloqueig de pop-ups
    const newWindow = window.open(catalogUrl, '_blank', 'noopener,noreferrer');

    try {
      // Guardar lead a la base de dades amb UTMs
      const utmData = getUtmData();
      await submitCatalogLead(email, 'footer', utmData);

      setIsSuccess(true);

      // Reset després de 3 segons
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
      }, 3000);

    } catch (err) {
      setError(lang === 'es' ? 'Error al procesar. Inténtalo de nuevo.' : 'Error processing. Try again.');
      // Si hi ha error, tancar la finestra que hem obert
      if (newWindow) {
        newWindow.close();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: About */}
          <div className="lg:col-span-1">
            <a 
              href="https://grupoeacom.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mb-6"
            >
              <img 
                src={footerLogo} 
                alt="EportsTech - Grupo EACOM" 
                className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </a>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {aboutText}
            </p>
            {/* Social Links */}
            {hasSocialLinks && (
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">{TEXTS.followUs[lang]}</p>
              <div className="flex gap-3">
                {socialMedia.linkedin && (
                <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" 
                   className="p-2 bg-slate-800 hover:bg-primary-600 rounded-lg transition-colors">
                  <Linkedin size={18} />
                </a>
                )}
                {socialMedia.twitter && (
                <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer"
                   className="p-2 bg-slate-800 hover:bg-primary-600 rounded-lg transition-colors">
                  <Twitter size={18} />
                </a>
                )}
                {socialMedia.facebook && (
                <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                   className="p-2 bg-slate-800 hover:bg-primary-600 rounded-lg transition-colors">
                  <Facebook size={18} />
                </a>
                )}
              </div>
            </div>
            )}
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-white font-semibold mb-6">{TEXTS.servicesTitle[lang]}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#services" className="text-sm text-slate-400 hover:text-white transition-colors">
                  {TEXTS.service1[lang]}
                </a>
              </li>
              <li>
                <a href="#services" className="text-sm text-slate-400 hover:text-white transition-colors">
                  {TEXTS.service2[lang]}
                </a>
              </li>
              <li>
                <a href="#services" className="text-sm text-slate-400 hover:text-white transition-colors">
                  {TEXTS.service3[lang]}
                </a>
              </li>
              <li>
                <a href="#services" className="text-sm text-slate-400 hover:text-white transition-colors">
                  {TEXTS.service4[lang]}
                </a>
              </li>
              <li className="pt-2">
                <a 
                  href="https://eportsinternet.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {TEXTS.residentialLink[lang]}
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">{TEXTS.contactTitle[lang]}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-400">{contactAddress}</span>
              </li>
              <li>
                <a href={`tel:${contactPhone.replace(/\s/g, '')}`} 
                   className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                  <Phone size={18} className="text-primary-400" />
                  {contactPhone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contactEmail}`}
                   className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                  <Mail size={18} className="text-primary-400" />
                  {contactEmail}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Catalog Download */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FileDown size={18} className="text-primary-400" />
              {TEXTS.catalogTitle[lang]}
            </h4>
            <p className="text-sm text-slate-400 mb-4">
              {TEXTS.catalogDesc[lang]}
            </p>
            
            <form onSubmit={handleCatalogDownload} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={TEXTS.emailPlaceholder[lang]}
                  disabled={isSubmitting || isSuccess}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
                />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  isSuccess 
                    ? 'bg-green-600 text-white' 
                    : 'bg-primary-600 hover:bg-primary-500 text-white'
                } disabled:opacity-70`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {TEXTS.downloading[lang]}
                  </>
                ) : isSuccess ? (
                  <>
                    <Check size={16} />
                    {TEXTS.downloadSuccess[lang]}
                  </>
                ) : (
                  <>
                    <FileDown size={16} />
                    {TEXTS.downloadBtn[lang]}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-slate-500">
              {copyrightText} {TEXTS.allRightsReserved[lang]}
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-slate-500 hover:text-white transition-colors">
                {privacyText}
              </Link>
              <Link to="/legal" className="text-slate-500 hover:text-white transition-colors">
                {legalText}
              </Link>
              <Link to="/cookies" className="text-slate-500 hover:text-white transition-colors">
                {cookiesText}
              </Link>
              <Link to="/admin" className="text-slate-700 hover:text-slate-500 transition-colors" title="Admin">
                <Lock size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
