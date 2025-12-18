import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import BenefitsSection from './components/BenefitsSection';
import ContactForm from './components/ContactForm';
import Chatbot from './components/Chatbot';
import SolutionsConfigurator from './components/SolutionsConfigurator';
import NeedsAssessment from './components/NeedsAssessment';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import SyncPage from './pages/SyncPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';
import LegalNotice from './pages/LegalNotice';
import CookieConsent from './components/CookieConsent';
import { Language, ConfiguratorItem, BrandConfig, Service } from './types';
import { initGA, trackPageView } from './services/analytics';
import { useBrandConfigWithCache } from './hooks/useBrandConfigWithCache';

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

  // Handler per recomanacions del NeedsAssessment
  const handleNeedsAssessmentRequest = (recommendations: any[]) => {
    const itemsList = recommendations.map(rec => `- ${rec.title[lang]}: ${rec.description[lang]}`).join('\n');
    
    let intro = "";
    switch (lang) {
        case 'es': intro = "Hola, tras usar vuestro asesor virtual, estoy interesado en recibir información sobre las siguientes soluciones recomendadas:\n\n"; break;
        case 'ca': intro = "Hola, després d'usar el vostre assessor virtual, estic interessat en rebre informació sobre les següents solucions recomanades:\n\n"; break;
        case 'fr': intro = "Bonjour, après avoir utilisé votre conseiller virtuel, je souhaite recevoir des informations sur les solutions recommandées suivantes:\n\n"; break;
        case 'de': intro = "Hallo, nach der Nutzung Ihres virtuellen Beraters interessiere ich mich für folgende empfohlene Lösungen:\n\n"; break;
        case 'it': intro = "Salve, dopo aver utilizzato il vostro consulente virtuale, sono interessato alle seguenti soluzioni consigliate:\n\n"; break;
        default: intro = "Hello, after using your virtual advisor, I am interested in receiving information about the following recommended solutions:\n\n";
    }

    const msg = `${intro}${itemsList}`;
    setCustomMessage(msg);
    setPrefilledService('Virtual Advisor Recommendations');

    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

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

  return (
    <>
      <Hero lang={lang} config={brandConfig.hero} onConsultationRequest={handleConsultationRequest} />
      <BenefitsSection lang={lang} config={brandConfig.benefits} />
      <ServicesSection lang={lang} onServiceRequest={handleServiceRequest} />
      <NeedsAssessment lang={lang} onRecommendations={handleNeedsAssessmentRequest} />
      <SolutionsConfigurator lang={lang} onRequestQuote={handleConfiguratorRequest} />
      <ContactForm 
          lang={lang} 
          prefilledMessage={customMessage} 
          prefilledService={prefilledService}
          contactEmail={brandConfig.contactEmail}
          contactPhone={brandConfig.contactPhone}
      />
      
      {/* Footer Component */}
      <Footer lang={lang} brandConfig={brandConfig} />
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
      <div className="min-h-screen flex flex-col font-sans bg-white">
        <Navbar currentLang={language} setLanguage={setLanguage} logoUrl={brandConfig.navLogo} />
        
        <Routes>
          <Route path="/" element={<HomePage lang={language} brandConfig={brandConfig} />} />
          <Route path="/sync" element={<SyncPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
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
