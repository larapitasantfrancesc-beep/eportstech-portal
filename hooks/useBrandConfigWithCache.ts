import { useState, useEffect, useCallback } from 'react';
import { BrandConfig } from '../types';
import { supabase } from '../services/supabaseClient';
import { TRANSLATIONS } from '../constants';

// NOTA: Aquest fitxer va a /hooks/useBrandConfigWithCache.ts
// Els imports són relatius a la carpeta hooks/

const CACHE_KEY = 'eportstech_brand_config';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuts màxim sense verificar versió

interface CachedConfig {
  data: BrandConfig;
  version: number;
  timestamp: number;
}

const DEFAULT_CONFIG: BrandConfig = {
  siteName: 'EportsTech',
  favicon: '',
  navLogo: '/logo-blue.png',
  footerLogo: '/logo-white.png',
  contactEmail: 'contact@eportstech.com',
  contactPhone: '+34 900 123 456',
  hero: {
    image: '/hq-background.jpg',
    imagePosition: 'center',
    overlayOpacity: 0.6,
    title: TRANSLATIONS.heroTitle,
    subtitle: TRANSLATIONS.heroSubtitle,
    ctaText: TRANSLATIONS.ctaButton
  },
  benefits: {
    mainTitle: TRANSLATIONS.benefitsTitle,
    subtitle: TRANSLATIONS.benefitsSubtitle,
    items: []
  },
  footer: {
    copyrightText: { es: '© 2024', ca: '© 2024', en: '© 2024', fr: '© 2024', de: '© 2024', it: '© 2024' },
    privacyText: { es: 'Privacidad', ca: 'Privacitat', en: 'Privacy', fr: 'Confidentialité', de: 'Datenschutz', it: 'Privacy' },
    legalText: { es: 'Legal', ca: 'Legal', en: 'Legal', fr: 'Légal', de: 'Rechtlich', it: 'Legale' },
    cookiesText: { es: 'Cookies', ca: 'Cookies', en: 'Cookies', fr: 'Cookies', de: 'Cookies', it: 'Cookies' }
  }
};

/**
 * Hook optimitzat per bandwidth que:
 * 1. Carrega des de localStorage si existeix cache vàlid
 * 2. Verifica només la versió (query lleugera: ~100 bytes)
 * 3. Només fa fetch complet si la versió ha canviat
 * 4. Refrescar manualment disponible via refreshConfig()
 */
export const useBrandConfigWithCache = () => {
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(() => {
    // Intentar carregar des de cache immediatament
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached) as CachedConfig;
        return data;
      }
    } catch (e) {
      console.warn('Error loading cached config:', e);
    }
    return DEFAULT_CONFIG;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Obtenir només la versió (query molt lleugera)
  const getRemoteVersion = useCallback(async (): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('brand_config')
        .select('config_version')
        .single();

      if (error || !data) {
        console.warn('Could not fetch config version:', error);
        return -1;
      }
      return data.config_version || 0;
    } catch (e) {
      console.error('Error fetching version:', e);
      return -1;
    }
  }, []);

  // Obtenir config completa (només quan necessari)
const fetchFullConfig = useCallback(async (): Promise<{ config: BrandConfig; version: number } | null> => {
  try {
    const { data, error } = await supabase
      .from('brand_config')
      .select('*')
      .single();

    if (error || !data) {
      console.warn('Could not fetch brand config:', error);
      return null;
    }

    // 🔧 MAPPING: lowercase (BD) → camelCase (codi)
    // Primer construir l'objecte hero amb els camps separats de la BD
    const heroFromDb = data.hero || {};
    const heroConfig = {
      ...heroFromDb,
      // Prioritzar camps separats si existeixen (són els més actualitzats)
      video: data.hero_video || heroFromDb.video || '',
      videoFallbackGif: data.hero_video_fallback_gif || heroFromDb.videoFallbackGif || '',
      mediaType: data.hero_media_type || heroFromDb.mediaType || 'auto',
      videoAutoplay: data.hero_video_autoplay !== null ? data.hero_video_autoplay : (heroFromDb.videoAutoplay !== undefined ? heroFromDb.videoAutoplay : true),
      videoLoop: data.hero_video_loop !== null ? data.hero_video_loop : (heroFromDb.videoLoop !== undefined ? heroFromDb.videoLoop : true),
      videoMuted: data.hero_video_muted !== null ? data.hero_video_muted : (heroFromDb.videoMuted !== undefined ? heroFromDb.videoMuted : true),
    };

    const config: BrandConfig = {
      siteName: data.sitename || '',
      favicon: data.favicon || '',
      navLogo: data.navlogo || '/logo-blue.png',
      footerLogo: data.footerlogo || '/logo-white.png',
      contactEmail: data.contactemail || 'contact@eportstech.com',
      contactPhone: data.contactphone || '+34 900 123 456',
      hero: heroConfig,
      benefits: data.benefits || { mainTitle: {}, subtitle: {}, items: [] },
      footer: data.footer || {}
    };

    return {
      config,
      version: data.config_version || 0
    };
  } catch (e) {
    console.error('Error fetching config:', e);
    return null;
  }
}, []);

  // Guardar a cache
  const saveToCache = useCallback((config: BrandConfig, version: number) => {
    try {
      const cacheData: CachedConfig = {
        data: config,
        version,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (e) {
      console.warn('Error saving to cache:', e);
    }
  }, []);

  // Obtenir cache actual
  const getCache = useCallback((): CachedConfig | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached) as CachedConfig;
      }
    } catch (e) {
      console.warn('Error reading cache:', e);
    }
    return null;
  }, []);

  // Lògica principal de càrrega intel·ligent
  const loadConfig = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    const cache = getCache();
    const now = Date.now();

    // Si tenim cache i no és forçat, verificar si necessitem actualitzar
    if (cache && !forceRefresh) {
      const cacheAge = now - cache.timestamp;

      // Si cache és molt recent (< 30 segons), usar-lo directament
      if (cacheAge < 30000) {
        console.log('📦 Using fresh cache (< 30s old)');
        setBrandConfig(cache.data);
        setIsLoading(false);
        return;
      }

      // Si cache té menys de 5 minuts, verificar només la versió
      if (cacheAge < CACHE_DURATION) {
        console.log('🔍 Checking version only...');
        const remoteVersion = await getRemoteVersion();

        if (remoteVersion === cache.version) {
          // Versió igual, actualitzar timestamp i usar cache
          console.log('✅ Version unchanged, using cache');
          saveToCache(cache.data, cache.version);
          setBrandConfig(cache.data);
          setIsLoading(false);
          setLastRefresh(new Date());
          return;
        }

        console.log(`🔄 Version changed (${cache.version} → ${remoteVersion}), fetching full config...`);
      }
    }

    // Fetch complet necessari
    console.log('📥 Fetching full brand config...');
    const result = await fetchFullConfig();

    if (result) {
      setBrandConfig(result.config);
      saveToCache(result.config, result.version);
      console.log('✅ Brand config loaded and cached (v' + result.version + ')');
    } else {
      // Si falla i tenim cache, usar cache
      if (cache) {
        console.log('⚠️ Fetch failed, using stale cache');
        setBrandConfig(cache.data);
      }
    }

    setIsLoading(false);
    setLastRefresh(new Date());
  }, [getCache, getRemoteVersion, fetchFullConfig, saveToCache]);

  // Funció per forçar refrescar (per usar des de l'admin)
  const refreshConfig = useCallback(async () => {
    console.log('🔄 Force refreshing config...');
    await loadConfig(true);
  }, [loadConfig]);

  // Carregar al muntar
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Verificar versió periòdicament (cada 2 minuts, només check de versió)
  useEffect(() => {
    const interval = setInterval(async () => {
      const cache = getCache();
      if (cache) {
        const remoteVersion = await getRemoteVersion();
        if (remoteVersion !== -1 && remoteVersion !== cache.version) {
          console.log('🔄 Version changed in background, refreshing...');
          await loadConfig(true);
        }
      }
    }, 2 * 60 * 1000); // Cada 2 minuts

    return () => clearInterval(interval);
  }, [getCache, getRemoteVersion, loadConfig]);

  return {
    brandConfig,
    isLoading,
    lastRefresh,
    refreshConfig // Exportar per poder cridar manualment des de l'admin
  };
};

// Funció per invalidar cache (cridar després de guardar a l'admin)
export const invalidateBrandConfigCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('🗑️ Brand config cache invalidated');
  } catch (e) {
    console.warn('Error invalidating cache:', e);
  }
};
