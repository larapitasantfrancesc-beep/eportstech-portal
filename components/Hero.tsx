import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Building2 } from 'lucide-react';
import { HeroConfig, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { trackEvent } from '../services/analytics';

interface HeroProps {
  lang: Language;
  config: HeroConfig;
  onConsultationRequest?: () => void;
}

// 🔧 Hook per detectar si la connexió és lenta
const useConnectionSpeed = () => {
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const checkConnection = () => {
        const saveData = connection.saveData;
        const effectiveType = connection.effectiveType; // 'slow-2g', '2g', '3g', '4g'
        const isSlowNetwork = saveData || effectiveType === 'slow-2g' || effectiveType === '2g';
        setIsSlowConnection(isSlowNetwork);
      };
      
      checkConnection();
      connection.addEventListener('change', checkConnection);
      return () => connection.removeEventListener('change', checkConnection);
    }
  }, []);

  return isSlowConnection;
};

// 🎬 Component per renderitzar el mèdia de fons
const HeroMedia: React.FC<{
  videoSrc?: string;
  gifSrc?: string;
  imageSrc: string;
  imagePosition: string;
  mediaType: 'video' | 'image' | 'auto';
  videoAutoplay: boolean;
  videoLoop: boolean;
  videoMuted: boolean;
}> = ({ videoSrc, gifSrc, imageSrc, imagePosition, mediaType, videoAutoplay, videoLoop, videoMuted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const isSlowConnection = useConnectionSpeed();

  // Resetejar error quan canvia el vídeo
  useEffect(() => {
    if (videoSrc) {
      setVideoError(false);
      setMediaLoaded(false);
    }
  }, [videoSrc]);

  // Determinar quin mèdia mostrar
  const shouldShowVideo = () => {
    if (mediaType === 'image') return false;
    if (!videoSrc) return false;
    if (videoError) return false;
    if (mediaType === 'auto' && isSlowConnection) return false;
    return true;
  };

  const shouldShowGif = () => {
    if (!gifSrc) return false;
    if (shouldShowVideo()) return false;
    if (mediaType === 'auto' && isSlowConnection) return false;
    return true;
  };

  // Intentar reproduir el vídeo quan es carrega
  useEffect(() => {
    if (videoRef.current && shouldShowVideo()) {
      videoRef.current.play().catch(() => {
        setVideoError(true);
      });
    }
  }, [videoSrc, mediaType, isSlowConnection]);

  const showVideo = shouldShowVideo();
  const showGif = shouldShowGif();

  return (
    <>
      {/* Vídeo de fons */}
      {showVideo && videoSrc && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectPosition: imagePosition }}
          autoPlay={videoAutoplay}
          loop={videoLoop}
          muted={videoMuted}
          playsInline
          onLoadedData={() => setMediaLoaded(true)}
          onError={() => setVideoError(true)}
        >
          <source src={videoSrc} type={videoSrc.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
        </video>
      )}

      {/* GIF de fons (fallback del vídeo) */}
      {showGif && gifSrc && !showVideo && (
        <img
          src={gifSrc}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: imagePosition }}
        />
      )}

      {/* Imatge de fons (fallback final - sempre present per carregar ràpid) */}
      <img
        src={imageSrc}
        alt="EportsTech Headquarters"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          (showVideo && mediaLoaded) || showGif ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ objectPosition: imagePosition }}
      />
    </>
  );
};

const Hero: React.FC<HeroProps> = ({ lang, config, onConsultationRequest }) => {
  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent('cta_click', {
      location: 'hero_section',
      label: 'request_consultation'
    });
    if (onConsultationRequest) {
      onConsultationRequest();
    }
  };

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent('cta_click', {
      location: 'hero_section',
      label: 'browse_solutions'
    });
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Configuració de mèdia
  const imageSrc = config.image || "/hq-background.jpg";
  const videoSrc = (config as any).video || undefined;
  const gifSrc = (config as any).videoFallbackGif || undefined;
  const mediaType = (config as any).mediaType || 'auto';
  const videoAutoplay = (config as any).videoAutoplay !== false;
  const videoLoop = (config as any).videoLoop !== false;
  const videoMuted = (config as any).videoMuted !== false;
  
  // Textos
  const title = config.title?.[lang] || TRANSLATIONS.heroTitle[lang];
  const subtitle = config.subtitle?.[lang] || TRANSLATIONS.heroSubtitle[lang];
  const ctaText = config.ctaText?.[lang] || TRANSLATIONS.ctaButton[lang];
  
  // Tagline editable amb fallback per idioma
  const defaultTaglines: Record<Language, string> = {
    es: 'Soluciones Empresariales',
    ca: 'Solucions Empresarials',
    en: 'Business Solutions',
    fr: 'Solutions Entreprises',
    de: 'Geschäftslösungen',
    it: 'Soluzioni Aziendali'
  };
  const tagline = config.tagline?.[lang] || defaultTaglines[lang];
  
  const opacity = config.overlayOpacity !== undefined ? config.overlayOpacity : 0.6;
  const imagePosition = config.imagePosition || 'center';

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden min-h-[85vh] flex items-center">
      
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <HeroMedia
          videoSrc={videoSrc}
          gifSrc={gifSrc}
          imageSrc={imageSrc}
          imagePosition={imagePosition}
          mediaType={mediaType}
          videoAutoplay={videoAutoplay}
          videoLoop={videoLoop}
          videoMuted={videoMuted}
        />
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-slate-900 transition-colors duration-500"
          style={{ backgroundColor: `rgba(15, 23, 42, ${opacity})` }} 
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent"></div>
      </div>
      
      {/* Abstract Shapes Overlay */}
      <div 
        className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-500 blur-3xl animate-pulse pointer-events-none"
        style={{ opacity: opacity * 0.4 }}
      ></div>
      <div 
        className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-600 blur-3xl pointer-events-none"
        style={{ opacity: opacity * 0.4 }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <div className="lg:w-3/4 animate-fade-in-up">
          {/* Business Solutions Tag */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20 shadow-lg">
            <Building2 size={16} className="text-primary-300" />
            <span className="tracking-wide">{tagline}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-tight mb-6 drop-shadow-2xl">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-200 mb-10 font-light max-w-2xl leading-relaxed drop-shadow-lg">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleCtaClick}
              className="group inline-flex items-center justify-center bg-primary-600 hover:bg-primary-500 text-white text-lg font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-primary-500/25 cursor-pointer"
            >
              {ctaText}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            
            <a 
              href="#services" 
              onClick={handleServicesClick}
              className="inline-flex items-center justify-center bg-white/5 border border-white/30 hover:bg-white/10 text-white text-lg font-medium px-8 py-4 rounded-lg transition-colors backdrop-blur-md"
            >
              {TRANSLATIONS.servicesTitle[lang]}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
