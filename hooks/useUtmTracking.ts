/**
 * Hook per capturar i gestionar paràmetres UTM i Google Ads (gclid)
 * 
 * Captura automàticament els paràmetres de la URL quan l'usuari arriba
 * i els guarda a sessionStorage per persistir durant la sessió.
 */

import { useEffect, useState } from 'react';

export interface UtmParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;  // Google Click ID per Google Ads
}

const UTM_STORAGE_KEY = 'eportstech_utm_params';

/**
 * Extreu els paràmetres UTM de la URL actual
 */
const extractUtmFromUrl = (): UtmParams => {
  if (typeof window === 'undefined') {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
      gclid: null,
    };
  }

  const params = new URLSearchParams(window.location.search);
  
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
    gclid: params.get('gclid'),
  };
};

/**
 * Comprova si hi ha algun paràmetre UTM present
 */
const hasAnyUtm = (params: UtmParams): boolean => {
  return Object.values(params).some(value => value !== null && value !== '');
};

/**
 * Guarda els paràmetres UTM a sessionStorage
 */
const saveUtmToStorage = (params: UtmParams): void => {
  if (typeof window !== 'undefined' && hasAnyUtm(params)) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(params));
    console.log('📊 [UTM] Paràmetres guardats:', params);
  }
};

/**
 * Recupera els paràmetres UTM de sessionStorage
 */
const getUtmFromStorage = (): UtmParams | null => {
  if (typeof window === 'undefined') return null;
  
  const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Hook principal per gestionar UTMs
 * 
 * Ús:
 * ```tsx
 * const { utmParams, isFromGoogleAds, campaignName } = useUtmTracking();
 * 
 * // Passar a funcions de submit
 * await submitLead({ ...formData, ...utmParams });
 * ```
 */
export const useUtmTracking = () => {
  const [utmParams, setUtmParams] = useState<UtmParams>({
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    gclid: null,
  });

  useEffect(() => {
    // Primer, intentar extreure de la URL actual
    const urlParams = extractUtmFromUrl();
    
    if (hasAnyUtm(urlParams)) {
      // Si tenim paràmetres a la URL, guardar-los
      saveUtmToStorage(urlParams);
      setUtmParams(urlParams);
    } else {
      // Si no, intentar recuperar de sessionStorage
      const storedParams = getUtmFromStorage();
      if (storedParams) {
        setUtmParams(storedParams);
      }
    }
  }, []);

  // Helpers útils
  const isFromGoogleAds = Boolean(utmParams.gclid) || utmParams.utm_source === 'google';
  const isFromPaidCampaign = Boolean(utmParams.utm_medium === 'cpc' || utmParams.utm_medium === 'ppc' || utmParams.gclid);
  const campaignName = utmParams.utm_campaign || null;
  const trafficSource = utmParams.utm_source || (utmParams.gclid ? 'google_ads' : 'direct');

  return {
    utmParams,
    isFromGoogleAds,
    isFromPaidCampaign,
    campaignName,
    trafficSource,
    // Funció per obtenir només els camps no-null (per enviar a Supabase)
    getUtmData: (): Partial<UtmParams> => {
      const data: Partial<UtmParams> = {};
      if (utmParams.utm_source) data.utm_source = utmParams.utm_source;
      if (utmParams.utm_medium) data.utm_medium = utmParams.utm_medium;
      if (utmParams.utm_campaign) data.utm_campaign = utmParams.utm_campaign;
      if (utmParams.utm_term) data.utm_term = utmParams.utm_term;
      if (utmParams.utm_content) data.utm_content = utmParams.utm_content;
      if (utmParams.gclid) data.gclid = utmParams.gclid;
      return data;
    }
  };
};

/**
 * Funció standalone per obtenir UTMs sense hook (útil per funcions fora de React)
 */
export const getUtmParams = (): Partial<UtmParams> => {
  // Primer mirar URL
  const urlParams = extractUtmFromUrl();
  if (hasAnyUtm(urlParams)) {
    return urlParams;
  }
  
  // Després sessionStorage
  const stored = getUtmFromStorage();
  if (stored) {
    return stored;
  }
  
  return {};
};

export default useUtmTracking;
