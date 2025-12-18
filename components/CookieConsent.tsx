import React, { useState, useEffect } from 'react';
import { Cookie, X, Check, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language } from '../types';

interface CookieConsentProps {
  lang: Language;
}

// Traduccions
const TRANSLATIONS: Record<Language, {
  title: string;
  description: string;
  acceptAll: string;
  rejectAll: string;
  customize: string;
  save: string;
  necessary: string;
  necessaryDesc: string;
  analytics: string;
  analyticsDesc: string;
  marketing: string;
  marketingDesc: string;
  moreInfo: string;
}> = {
  es: {
    title: 'Usamos cookies',
    description: 'Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y mostrarte contenido personalizado.',
    acceptAll: 'Aceptar todas',
    rejectAll: 'Rechazar todas',
    customize: 'Configurar',
    save: 'Guardar preferencias',
    necessary: 'Necesarias',
    necessaryDesc: 'Esenciales para el funcionamiento del sitio web. No se pueden desactivar.',
    analytics: 'Analíticas',
    analyticsDesc: 'Nos ayudan a entender cómo usas el sitio web mediante Google Analytics.',
    marketing: 'Marketing',
    marketingDesc: 'Permiten mostrarte anuncios relevantes y medir su efectividad.',
    moreInfo: 'Más información en nuestra'
  },
  ca: {
    title: 'Utilitzem cookies',
    description: 'Utilitzem cookies pròpies i de tercers per millorar la teva experiència, analitzar el trànsit i mostrar-te contingut personalitzat.',
    acceptAll: 'Acceptar totes',
    rejectAll: 'Rebutjar totes',
    customize: 'Configurar',
    save: 'Desar preferències',
    necessary: 'Necessàries',
    necessaryDesc: 'Essencials per al funcionament del lloc web. No es poden desactivar.',
    analytics: 'Analítiques',
    analyticsDesc: 'Ens ajuden a entendre com uses el lloc web mitjançant Google Analytics.',
    marketing: 'Màrqueting',
    marketingDesc: 'Permeten mostrar-te anuncis rellevants i mesurar la seva efectivitat.',
    moreInfo: 'Més informació a la nostra'
  },
  en: {
    title: 'We use cookies',
    description: 'We use our own and third-party cookies to improve your experience, analyze traffic and show you personalized content.',
    acceptAll: 'Accept all',
    rejectAll: 'Reject all',
    customize: 'Customize',
    save: 'Save preferences',
    necessary: 'Necessary',
    necessaryDesc: 'Essential for the website to function. Cannot be disabled.',
    analytics: 'Analytics',
    analyticsDesc: 'Help us understand how you use the website through Google Analytics.',
    marketing: 'Marketing',
    marketingDesc: 'Allow us to show you relevant ads and measure their effectiveness.',
    moreInfo: 'More information in our'
  },
  fr: {
    title: 'Nous utilisons des cookies',
    description: 'Nous utilisons nos propres cookies et ceux de tiers pour améliorer votre expérience, analyser le trafic et vous montrer du contenu personnalisé.',
    acceptAll: 'Tout accepter',
    rejectAll: 'Tout refuser',
    customize: 'Personnaliser',
    save: 'Enregistrer les préférences',
    necessary: 'Nécessaires',
    necessaryDesc: 'Essentiels au fonctionnement du site web. Ne peuvent pas être désactivés.',
    analytics: 'Analytiques',
    analyticsDesc: 'Nous aident à comprendre comment vous utilisez le site web via Google Analytics.',
    marketing: 'Marketing',
    marketingDesc: 'Permettent de vous montrer des publicités pertinentes et de mesurer leur efficacité.',
    moreInfo: 'Plus d\'informations dans notre'
  },
  de: {
    title: 'Wir verwenden Cookies',
    description: 'Wir verwenden eigene Cookies und Cookies von Drittanbietern, um Ihre Erfahrung zu verbessern, den Verkehr zu analysieren und Ihnen personalisierte Inhalte zu zeigen.',
    acceptAll: 'Alle akzeptieren',
    rejectAll: 'Alle ablehnen',
    customize: 'Anpassen',
    save: 'Einstellungen speichern',
    necessary: 'Notwendig',
    necessaryDesc: 'Wesentlich für das Funktionieren der Website. Können nicht deaktiviert werden.',
    analytics: 'Analytik',
    analyticsDesc: 'Helfen uns zu verstehen, wie Sie die Website über Google Analytics nutzen.',
    marketing: 'Marketing',
    marketingDesc: 'Ermöglichen es uns, Ihnen relevante Anzeigen zu zeigen und deren Wirksamkeit zu messen.',
    moreInfo: 'Weitere Informationen in unserer'
  },
  it: {
    title: 'Utilizziamo i cookie',
    description: 'Utilizziamo cookie propri e di terze parti per migliorare la tua esperienza, analizzare il traffico e mostrarti contenuti personalizzati.',
    acceptAll: 'Accetta tutti',
    rejectAll: 'Rifiuta tutti',
    customize: 'Personalizza',
    save: 'Salva preferenze',
    necessary: 'Necessari',
    necessaryDesc: 'Essenziali per il funzionamento del sito web. Non possono essere disattivati.',
    analytics: 'Analitici',
    analyticsDesc: 'Ci aiutano a capire come utilizzi il sito web tramite Google Analytics.',
    marketing: 'Marketing',
    marketingDesc: 'Permettono di mostrarti annunci pertinenti e misurarne l\'efficacia.',
    moreInfo: 'Maggiori informazioni nella nostra'
  }
};

// Tipus de consentiment
interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ lang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true, // Sempre activat
    analytics: false,
    marketing: false
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  useEffect(() => {
    // Comprovar si ja hi ha consentiment guardat
    const savedConsent = localStorage.getItem('cookie_consent');
    if (!savedConsent) {
      // Mostrar banner si no hi ha consentiment
      setIsVisible(true);
      // Inicialitzar Google Consent Mode amb tot denegat
      updateGoogleConsent({
        necessary: true,
        analytics: false,
        marketing: false
      });
    } else {
      // Aplicar consentiment guardat
      const parsed = JSON.parse(savedConsent);
      setConsent(parsed);
      updateGoogleConsent(parsed);
    }
  }, []);

  // Actualitzar Google Consent Mode v2
  const updateGoogleConsent = (consentState: ConsentState) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': consentState.analytics ? 'granted' : 'denied',
        'ad_storage': consentState.marketing ? 'granted' : 'denied',
        'ad_user_data': consentState.marketing ? 'granted' : 'denied',
        'ad_personalization': consentState.marketing ? 'granted' : 'denied',
        'functionality_storage': 'granted',
        'personalization_storage': consentState.analytics ? 'granted' : 'denied',
        'security_storage': 'granted'
      });
    }
  };

  const saveConsent = (consentState: ConsentState) => {
    localStorage.setItem('cookie_consent', JSON.stringify(consentState));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    updateGoogleConsent(consentState);
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    setConsent(allAccepted);
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const allRejected = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    setConsent(allRejected);
    saveConsent(allRejected);
  };

  const handleSavePreferences = () => {
    saveConsent(consent);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Cookie className="text-amber-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t.description}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            {t.moreInfo}{' '}
            <Link to="/cookies" className="text-primary-600 hover:underline" onClick={() => setIsVisible(false)}>
              {lang === 'es' ? 'Política de Cookies' : lang === 'ca' ? 'Política de Cookies' : 'Cookies Policy'}
            </Link>.
          </p>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="px-6 py-4 border-t border-gray-100 space-y-4">
            {/* Necessary */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{t.necessary}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                    {lang === 'es' ? 'Siempre activas' : lang === 'ca' ? 'Sempre actives' : 'Always active'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t.necessaryDesc}</p>
              </div>
              <div className="pt-1">
                <div className="w-10 h-6 bg-primary-500 rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="font-medium text-gray-900">{t.analytics}</span>
                <p className="text-xs text-gray-500 mt-1">{t.analyticsDesc}</p>
              </div>
              <button
                onClick={() => setConsent(prev => ({ ...prev, analytics: !prev.analytics }))}
                className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                  consent.analytics ? 'bg-primary-500 justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow"></div>
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="font-medium text-gray-900">{t.marketing}</span>
                <p className="text-xs text-gray-500 mt-1">{t.marketingDesc}</p>
              </div>
              <button
                onClick={() => setConsent(prev => ({ ...prev, marketing: !prev.marketing }))}
                className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                  consent.marketing ? 'bg-primary-500 justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow"></div>
              </button>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="p-6 pt-4 border-t border-gray-100">
          {showSettings ? (
            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
              >
                ← {lang === 'es' ? 'Volver' : lang === 'ca' ? 'Tornar' : 'Back'}
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-4 py-3 text-white bg-primary-600 hover:bg-primary-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Check size={18} />
                {t.save}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  {t.rejectAll}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-4 py-3 text-white bg-primary-600 hover:bg-primary-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  {t.acceptAll}
                </button>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Settings size={16} />
                {t.customize}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
