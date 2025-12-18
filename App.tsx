import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import BenefitsSection from './components/BenefitsSection';
import ContactForm from './components/ContactForm';
import Chatbot from './components/Chatbot';
import SolutionsConfigurator from './components/SolutionsConfigurator';
import NeedsAssessment from './components/NeedsAssessment';
import AdminDashboard from './pages/AdminDashboard';
import SyncPage from './pages/SyncPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';
import LegalNotice from './pages/LegalNotice';
import CookieConsent from './components/CookieConsent';
import { Language, ConfiguratorItem, BrandConfig, Service } from './types';
import { initGA, trackPageView } from './services/analytics';
import { useBrandConfigWithCache } from './hooks/useBrandConfigWithCache';
import { Lock } from 'lucide-react';

// Component to handle route tracking
const RouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

// Main Landing Page Layout
const HomePage: React.FC<{ lang: Language, brandConfig: BrandConfig }> = ({ lang, brandConfig }) => {
  const [customMessage, setCustomMessage] = useState<string>('');
  const [prefilledService, setPrefilledService] = useState<string>('');

  const handleConfiguratorRequest = (selectedItems: ConfiguratorItem[]) => {
    const itemsList = selectedItems.map(item => `- ${item.title[lang]} (${item.benefit[lang]})`).join('\n');
    
    let intro = "";
    switch (lang) {
        case 'es': intro = "Hola, estoy interesado en recibir información y presupuesto sobre la siguiente configuración personalizada para mi empresa:\n\n"; break;
        case 'ca': intro = "Hola, estic interessat en rebre informació i pressupost sobre la següent configuració personalitzada per a la meva empresa:\n\n"; break;
        case 'fr': intro = "Bonjour, je souhaite recevoir des informations et un devis pour la configuration personnalisée suivante pour mon entreprise:\n\n"; break;
        case 'de': intro = "Hallo, ich bin daran interessiert, Informationen und ein Angebot für die folgende kundenspezifische Konfiguration für mein Unternehmen zu erhalten:\n\n"; break;
        case 'it': intro = "Salve, sono interessato a ricevere informazioni e un preventivo per la seguente configurazione personalizzata per la mia azienda:\n\n"; break;
        default: intro = "Hello, I am interested in receiving information and a quote for the following custom configuration for my company:\n\n";
    }

    const msg = `${intro}${itemsList}`;
    setCustomMessage(msg);
    setPrefilledService('Custom Configuration');

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleServiceRequest = (service: Service) => {
    let msg = "";
    const title = service.title[lang];
    
    switch (lang) {
        case 'es': msg = `Hola, me gustaría solicitar más información y asesoramiento sobre vuestra solución de ${title}.`; break;
        case 'ca': msg = `Hola, m'agradaria sol·licitar més informació i assessorament sobre la vostra solució de ${title}.`; break;
        case 'fr': msg = `Bonjour, je souhaite demander plus d'informations sur votre solution ${title}.`; break;
        case 'de': msg = `Hallo, ich möchte weitere Informationen zu Ihrer Lösung ${title} anfordern.`; break;
        case 'it': msg = `Salve, vorrei richiedere maggiori informazioni sulla vostra soluzione ${title}.`; break;
        default: msg = `Hello, I would like to request more information about your ${title} solution.`;
    }

    setCustomMessage(msg);
    setPrefilledService(service.title.en);

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConsultationRequest = () => {
      let msg = "";
      switch (lang) {
          case 'es': msg = "Hola, estoy interesado en recibir una consultoría gratuita para analizar las necesidades tecnológicas de mi empresa."; break;
          case 'ca': msg = "Hola, estic interessat en rebre una consultoria gratuïta per analitzar les necessitats tecnològiques de la meva empresa."; break;
          case 'fr': msg = "Bonjour, je suis intéressé par une consultation gratuite pour analyser les besoins technologiques de mon entreprise."; break;
          case 'de': msg = "Hallo, ich bin an einer kostenlosen Beratung interessiert, um die technologischen Bedürfnisse meines Unternehmens zu analysieren."; break;
          case 'it': msg = "Salve, sono interessato a ricevere una consulenza gratuita per analizzare le esigenze tecnologiche della mia azienda."; break;
          default: msg = "Hello, I am interested in receiving a free consultation to analyze my company's technological needs.";
      }

      setCustomMessage(msg);
      setPrefilledService('Consulting');

      const contactSection = document.getElementById('contact');
      if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const footerLogo = brandConfig.footerLogo || "/logo-white.png";
  const privacyText = brandConfig.footer?.privacyText?.[lang] || "Privacy Policy";
  const legalText = brandConfig.footer?.legalText?.[lang] || "Legal Notice";
  const cookiesText = brandConfig.footer?.cookiesText?.[lang] || "Cookies";
  const copyrightText = brandConfig.footer?.copyrightText?.[lang] || `EportsTech © ${new Date().getFullYear()}`;

  return (
    <>
      <Hero lang={lang} config={brandConfig.hero} onConsultationRequest={handleConsultationRequest} />
      <BenefitsSection lang={lang} config={brandConfig.benefits} />
      <ServicesSection lang={lang} onServiceRequest={handleServiceRequest} />
      <NeedsAssessment lang={lang} />
      <SolutionsConfigurator lang={lang} onRequestQuote={handleConfiguratorRequest} />
      <ContactForm 
          lang={lang} 
          prefilledMessage={customMessage} 
          prefilledService={prefilledService}
          contactEmail={brandConfig.contactEmail}
          contactPhone={brandConfig.contactPhone}
      />
      
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          {/* ✅ Logo amb enllaç a grupoeacom.com */}
          <div className="mb-8">
              <a 
                href="https://grupoeacom.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Grupo EACOM"
              >
                <img 
                    src={footerLogo} 
                    alt="Eports Tech - Grupo EACOM" 
                    className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
              </a>
          </div>

          <p className="mb-6 text-sm opacity-80">{copyrightText}</p>
          
          {/* ✅ Links centrats */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm">
            <Link to="/privacy" className="hover:text-white transition-colors">{privacyText}</Link>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <Link to="/legal" className="hover:text-white transition-colors">{legalText}</Link>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <Link to="/cookies" className="hover:text-white transition-colors">{cookiesText}</Link>
          </div>
          
          {/* Admin link separat */}
          <div className="mt-6">
            <Link to="/admin" className="text-slate-700 hover:text-slate-500 transition-colors" title="Acceso Corporativo">
                <Lock size={12} />
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('es');
  
  const { brandConfig, isLoading } = useBrandConfigWithCache();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    if (brandConfig.siteName) {
      document.title = brandConfig.siteName;
    }
    
    if (brandConfig.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = brandConfig.favicon;
    }
  }, [brandConfig.siteName, brandConfig.favicon]);

  if (isLoading && !brandConfig.siteName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Carregant...</div>
      </div>
    );
  }

  return (
    <HashRouter>
      <RouteTracker />
      <div className="min-h-screen flex flex-col font-sans bg-white overflow-x-hidden">
        <Navbar currentLang={language} setLanguage={setLanguage} logoUrl={brandConfig.navLogo} />
        
        <Routes>
          <Route path="/" element={<HomePage lang={language} brandConfig={brandConfig} />} />
          <Route path="/sync" element={<SyncPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ✅ Noves rutes per pàgines legals */}
          <Route path="/privacy" element={<PrivacyPolicy lang={language} />} />
          <Route path="/cookies" element={<CookiesPolicy lang={language} />} />
          <Route path="/legal" element={<LegalNotice lang={language} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <div className="relative z-50">
           <Chatbot lang={language} />
        </div>
        
        {/* Cookie Consent Banner */}
        <CookieConsent lang={language} />
      </div>
    </HashRouter>
  );
};

export default App;
