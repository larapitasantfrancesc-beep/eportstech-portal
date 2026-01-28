
import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Image as ImageIcon, Home } from 'lucide-react';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { trackEvent } from '../services/analytics';

interface NavbarProps {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  logoUrl?: string;
}

// ✅ Traduccions per "Eports Residencial"
const RESIDENTIAL_TEXT: Record<Language, string> = {
  es: 'Eports Residencial',
  ca: 'Eports Residencial',
  en: 'Eports Residential',
  fr: 'Eports Résidentiel',
  de: 'Eports Privat',
  it: 'Eports Residenziale'
};

const Navbar: React.FC<NavbarProps> = ({ currentLang, setLanguage, logoUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    trackEvent('language_change', { language: lang });
  };

  const handleResidentialClick = () => {
    trackEvent('external_link', { destination: 'eportsinternet.com' });
  };

  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  const logoSrc = logoUrl || "/logo-blue.png";

  return (
    <>
      {/* Spacer per compensar l'altura de la navbar fixed */}
      <div className="h-24"></div>
      
      {/* Navbar fixed */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24 items-center">
            
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <Link to="/" className="flex items-center gap-2">
                  {!imgError ? (
                    <img 
                      src={logoSrc}
                      alt="Corporate Logo" 
                      className="h-16 w-auto object-contain max-w-[200px]"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="h-14 px-4 flex items-center justify-center border-2 border-dashed border-gray-200 rounded bg-gray-50 text-gray-400 text-xs font-bold tracking-widest gap-2">
                      <ImageIcon size={16} />
                      <span>LOGO</span>
                    </div>
                  )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {isHomePage ? (
                <>
                  <a href="#services" className="text-gray-600 hover:text-primary-600 font-medium transition-colors text-sm uppercase tracking-wide">
                      {TRANSLATIONS.navServices[currentLang]}
                  </a>
                  <a href="#about" className="text-gray-600 hover:text-primary-600 font-medium transition-colors text-sm uppercase tracking-wide">
                      {TRANSLATIONS.navAbout[currentLang]}
                  </a>
                  <a href="#contact" className="text-gray-600 hover:text-primary-600 font-medium transition-colors text-sm uppercase tracking-wide">
                      {TRANSLATIONS.navContact[currentLang]}
                  </a>
                </>
              ) : (
                <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium transition-colors text-sm uppercase tracking-wide">
                    {TRANSLATIONS.navHome[currentLang]}
                </Link>
              )}
              
              {/* ✅ NOU: Eports Residencial - Obre en nova finestra */}
              <a 
                href="https://eportsinternet.com" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={handleResidentialClick}
                className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium transition-colors text-sm uppercase tracking-wide border border-primary-200 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-full"
              >
                <Home size={14} />
                {RESIDENTIAL_TEXT[currentLang]}
              </a>
              
              {/* Language Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md transition-colors">
                  <Globe size={18} />
                  <span className="uppercase font-semibold text-sm">{currentLang}</span>
                </button>
                
                <div className="absolute right-0 w-32 mt-0 pt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block animate-fade-in">
                  <div className="py-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code as Language)}
                        className={`flex items-center w-full px-4 py-2 text-sm text-left ${currentLang === lang.code ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-gray-600 hover:text-primary-600 p-2">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full z-40">
            <div className="px-4 pt-4 pb-6 space-y-2">
               {isHomePage ? (
                 <>
                  <a href="#services" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md">
                      {TRANSLATIONS.navServices[currentLang]}
                  </a>
                  <a href="#contact" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md">
                      {TRANSLATIONS.navContact[currentLang]}
                  </a>
                 </>
               ) : (
                  <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md">
                      {TRANSLATIONS.navHome[currentLang]}
                  </Link>
               )}
              
              {/* ✅ NOU: Eports Residencial (Mòbil) */}
              <a 
                href="https://eportsinternet.com" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => {
                  handleResidentialClick();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-3 text-base font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-md"
              >
                <Home size={18} />
                {RESIDENTIAL_TEXT[currentLang]}
              </a>
              
              <div className="border-t border-gray-100 mt-4 pt-4">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Language</p>
                <div className="grid grid-cols-3 gap-3 px-3">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          handleLanguageChange(lang.code as Language);
                          setIsOpen(false);
                        }}
                        className={`flex items-center justify-center px-2 py-2 text-xs border rounded-md font-medium ${currentLang === lang.code ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}
                      >
                        {lang.code.toUpperCase()}
                      </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
