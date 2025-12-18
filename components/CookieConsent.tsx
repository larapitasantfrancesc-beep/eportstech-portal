import React, { useState, useEffect } from 'react';
import { Cookie, Check, Settings, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language } from '../types';

interface CookieConsentProps {
  lang: Language;
}

// Traduccions
const TRANSLATIONS: Record<Language, {
  message: string;
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
  cookiesPolicy: string;
}> = {
  es: {
    message: 'Utilizamos cookies para mejorar tu experiencia.',
    acceptAll: 'Aceptar',
    rejectAll: 'Rechazar',
    customize: 'Configurar',
    save: 'Guardar',
    necessary: 'Necesarias',
    necessaryDesc: 'Esenciales para el funcionamiento.',
    analytics: 'Analíticas',
    analyticsDesc: 'Google Analytics para estadísticas.',
    marketing: 'Marketing',
    marketingDesc: 'Anuncios personalizados.',
    moreInfo: 'Más info',
    cookiesPolicy: 'Política de Cookies'
  },
  ca: {
    message: 'Utilitzem cookies per millorar la teva experiència.',
    acceptAll: 'Acceptar',
    rejectAll: 'Rebutjar',
    customize: 'Configurar',
    save: 'Desar',
    necessary: 'Necessàries',
    necessaryDesc: 'Essencials per al funcionament.',
    analytics: 'Analítiques',
    analyticsDesc: 'Google Analytics per estadístiques.',
    marketing: 'Màrqueting',
    marketingDesc: 'Anuncis personalitzats.',
    moreInfo: 'Més info',
    cookiesPolicy: 'Política de Cookies'
  },
  en: {
    message: 'We use cookies to improve your experience.',
    acceptAll: 'Accept',
    rejectAll: 'Reject',
    customize: 'Settings',
    save: 'Save',
    necessary: 'Necessary',
    necessaryDesc: 'Essential for functionality.',
    analytics: 'Analytics',
    analyticsDesc: 'Google Analytics for statistics.',
    marketing: 'Marketing',
    marketingDesc: 'Personalized ads.',
    moreInfo: 'More info',
    cookiesPolicy: 'Cookies Policy'
  },
  fr: {
    message: 'Nous utilisons des cookies pour améliorer votre expérience.',
    acceptAll: 'Accepter',
    rejectAll: 'Refuser',
    customize: 'Paramètres',
    save: 'Sauvegarder',
    necessary: 'Nécessaires',
    necessaryDesc: 'Essentiels au fonctionnement.',
    analytics: 'Analytiques',
    analyticsDesc: 'Google Analytics pour les statistiques.',
    marketing: 'Marketing',
    marketingDesc: 'Publicités personnalisées.',
    moreInfo: 'Plus d\'info',
    cookiesPolicy: 'Politique de Cookies'
  },
  de: {
    message: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern.',
    acceptAll: 'Akzeptieren',
    rejectAll: 'Ablehnen',
    customize: 'Einstellungen',
    save: 'Speichern',
    necessary: 'Notwendig',
    necessaryDesc: 'Wesentlich für die Funktionalität.',
    analytics: 'Analytik',
    analyticsDesc: 'Google Analytics für Statistiken.',
    marketing: 'Marketing',
    marketingDesc: 'Personalisierte Werbung.',
    moreInfo: 'Mehr Info',
    cookiesPolicy: 'Cookie-Richtlinie'
  },
  it: {
    message: 'Utilizziamo i cookie per migliorare la tua esperienza.',
    acceptAll: 'Accetta',
    rejectAll: 'Rifiuta',
    customize: 'Impostazioni',
    save: 'Salva',
    necessary: 'Necessari',
    necessaryDesc: 'Essenziali per il funzionamento.',
    analytics: 'Analitici',
    analyticsDesc: 'Google Analytics per le statistiche.',
    marketing: 'Marketing',
    marketingDesc: 'Annunci personalizzati.',
    moreInfo: 'Più info',
    cookiesPolicy: 'Politica dei Cookie'
  }
};

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ lang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie_consent');
    if (!savedConsent) {
      setIsVisible(true);
      updateGoogleConsent({
        necessary: true,
        analytics: false,
        marketing: false
      });
    } else {
      const parsed = JSON.parse(savedConsent);
      setConsent(parsed);
      updateGoogleConsent(parsed);
    }
  }, []);

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
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleRejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    saveConsent(consent);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Banner inferior */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Missatge */}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Cookie className="text-amber-500 flex-shrink-0" size={20} />
              <span>
                {t.message}{' '}
                <Link 
                  to="/cookies" 
                  className="text-primary-600 hover:underline"
                  onClick={() => setIsVisible(false)}
                >
                  {t.moreInfo}
                </Link>
              </span>
            </div>

            {/* Botons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <Settings size={16} />
                <span className="hidden sm:inline">{t.customize}</span>
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                {t.rejectAll}
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors flex items-center gap-1"
              >
                <Check size={16} />
                {t.acceptAll}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de configuració (només quan es clica "Configurar") */}
      {showSettings && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Cookie className="text-amber-500" size={20} />
                <h3 className="font-semibold text-gray-900">{t.customize}</h3>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Opcions */}
            <div className="p-4 space-y-4">
              {/* Necessary */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900 text-sm">{t.necessary}</span>
                  <p className="text-xs text-gray-500">{t.necessaryDesc}</p>
                </div>
                <div className="w-10 h-6 bg-primary-500 rounded-full flex items-center justify-end px-1 opacity-50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900 text-sm">{t.analytics}</span>
                  <p className="text-xs text-gray-500">{t.analyticsDesc}</p>
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
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900 text-sm">{t.marketing}</span>
                  <p className="text-xs text-gray-500">{t.marketingDesc}</p>
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

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                {lang === 'es' ? 'Cancelar' : lang === 'ca' ? 'Cancel·lar' : 'Cancel'}
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Check size={16} />
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
