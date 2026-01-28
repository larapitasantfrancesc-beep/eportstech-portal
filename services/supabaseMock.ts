import { supabase } from './supabaseClient';
import { LeadForm, BrandConfig, ConfiguratorLead, NotificationSettings, GlobalSettings, Service, ConfiguratorItem, DynamicSection, ServiceCategory, ConfiguratorItemResult, BotConfig, BenefitsConfig } from "../types";
import { TRANSLATIONS, SERVICES_DATA, CONFIGURATOR_ITEMS } from '../constants';

// =====================================================
// EMAIL NOTIFICATIONS
// =====================================================

interface NotificationData {
  email: string;
  fullName?: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  message?: string;
  selectedItems?: string[];
  source?: string;
}

export const sendEmailNotification = async (
  type: 'lead' | 'configurator' | 'catalog',
  recipients: string[],
  data: NotificationData
): Promise<boolean> => {
  try {
    console.log('📧 [sendEmailNotification] Sending...', type, recipients);
    
    const response = await fetch('/.netlify/functions/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, recipients, data }),
    });

    if (!response.ok) {
      console.error('❌ [sendEmailNotification] Failed:', await response.text());
      return false;
    }

    console.log('✅ [sendEmailNotification] Sent successfully');
    return true;
  } catch (error) {
    console.error('❌ [sendEmailNotification] Error:', error);
    return false;
  }
};

export const uploadFileToStorage = async (file: File, bucket: string, path: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Storage upload exception:', error);
    return null;
  }
};

export const checkAuth = async (): Promise<boolean> => {
  const token = localStorage.getItem('supabase_auth_token');
  if (token) {
    console.log('✅ Token encontrado en localStorage');
    return true;
  }

  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

export const loginMock = async (password: string, email?: string): Promise<boolean> => {
  if (!email) {
     console.error("Email required for login");
     return false;
  }
  
  try {
    console.log('📤 [loginMock] Calling auth backend...');
    
    const response = await fetch('/.netlify/functions/auth-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Login failed:', errorData.error);
      return false;
    }

    const data = await response.json();

    if (!data.success) {
      console.error('❌ Login error:', data.error);
      return false;
    }

    if (data.session?.access_token) {
      localStorage.setItem('supabase_auth_token', data.session.access_token);
      console.log('✅ Token guardado');
    }

    console.log('✅ Login successful');
    return true;
  } catch (err) {
    console.error("❌ Login exception:", err);
    return false;
  }
};

export const logoutMock = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('supabase_auth_token');
};

export const getBrandConfig = async (): Promise<BrandConfig> => {
  const { data, error } = await supabase
    .from('brand_config')
    .select('*')
    .single();

  if (error || !data) {
    console.warn("Could not fetch brand config (using defaults/mock temporarily)", error);
    return {
        siteName: "EportsTech",
        favicon: "",
        navLogo: '/logo-blue.png',
        footerLogo: '/logo-white.png',
        contactEmail: 'contact@eportstech.com',
        contactPhone: '+34 900 123 456',
        hero: {
            image: '/hq-background.jpg',
            video: '',
            videoFallbackGif: '',
            mediaType: 'auto' as const,
            videoAutoplay: true,
            videoLoop: true,
            videoMuted: true,
            imagePosition: 'center',
            overlayOpacity: 0.6,
            title: TRANSLATIONS.heroTitle,
            subtitle: TRANSLATIONS.heroSubtitle,
            ctaText: TRANSLATIONS.ctaButton,
            tagline: { 
              es: 'Soluciones Empresariales', 
              ca: 'Solucions Empresarials', 
              en: 'Business Solutions', 
              fr: 'Solutions Entreprises', 
              de: 'Geschäftslösungen', 
              it: 'Soluzioni Aziendali' 
            }
        },
        benefits: {
            mainTitle: TRANSLATIONS.benefitsTitle,
            subtitle: TRANSLATIONS.benefitsSubtitle,
            items: []
        },
        footer: {
            copyrightText: { es: "© 2024", ca: "© 2024", en: "© 2024", fr: "© 2024", de: "© 2024", it: "© 2024" },
            privacyText: { es: "Privacidad", ca: "Privacitat", en: "Privacy", fr: "Confidentialité", de: "Datenschutz", it: "Privacy" },
            legalText: { es: "Legal", ca: "Legal", en: "Legal", fr: "Légal", de: "Rechtlich", it: "Legale" },
            cookiesText: { es: "Cookies", ca: "Cookies", en: "Cookies", fr: "Cookies", de: "Cookies", it: "Cookies" },
            aboutText: { 
              es: "EportsTech es la división empresarial de Grupo EACOM, especializada en soluciones de telecomunicaciones y servicios IT para empresas en España y Europa.",
              ca: "EportsTech és la divisió empresarial de Grup EACOM, especialitzada en solucions de telecomunicacions i serveis IT per a empreses a Espanya i Europa.",
              en: "EportsTech is the business division of Grupo EACOM, specialized in telecommunications solutions and IT services for companies in Spain and Europe.",
              fr: "EportsTech est la division entreprise du Grupo EACOM, spécialisée dans les solutions de télécommunications et services IT.",
              de: "EportsTech ist die Geschäftsabteilung der Grupo EACOM, spezialisiert auf Telekommunikationslösungen und IT-Services.",
              it: "EportsTech è la divisione aziendale di Grupo EACOM, specializzata in soluzioni di telecomunicazioni e servizi IT."
            },
            contactAddress: { 
              es: "Polígon Industrial, Tortosa, España",
              ca: "Polígon Industrial, Tortosa, Espanya",
              en: "Industrial Park, Tortosa, Spain",
              fr: "Zone Industrielle, Tortosa, Espagne",
              de: "Industriegebiet, Tortosa, Spanien",
              it: "Zona Industriale, Tortosa, Spagna"
            }
        }
    };
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
    videoAutoplay: data.hero_video_autoplay !== undefined ? data.hero_video_autoplay : (heroFromDb.videoAutoplay !== undefined ? heroFromDb.videoAutoplay : true),
    videoLoop: data.hero_video_loop !== undefined ? data.hero_video_loop : (heroFromDb.videoLoop !== undefined ? heroFromDb.videoLoop : true),
    videoMuted: data.hero_video_muted !== undefined ? data.hero_video_muted : (heroFromDb.videoMuted !== undefined ? heroFromDb.videoMuted : true),
  };

  return {
    siteName: data.sitename || '',
    favicon: data.favicon || '',
    navLogo: data.navlogo || '/logo-blue.png',
    footerLogo: data.footerlogo || '/logo-white.png',
    contactEmail: data.contactemail || 'contact@eportstech.com',
    contactPhone: data.contactphone || '+34 900 123 456',
    hero: heroConfig,
    benefits: data.benefits || { mainTitle: {}, subtitle: {}, items: [] },
    footer: data.footer || {},
    socialMedia: data.social_media || {},
    catalogUrl: data.catalog_url || 'https://drive.google.com/uc?export=download&id=1vweh1bRKZO7lpRudkzjoXDxzxc-s-SGm'
  } as BrandConfig;
};

export const updateBrandConfig = async (config: Partial<BrandConfig>, files?: Record<string, File>): Promise<boolean> => {
  let updatedConfig = { ...config };

  if (files) {
      if (files.navLogo) {
          const url = await uploadFileToStorage(files.navLogo, 'brand-assets', 'nav-logo');
          if (url) updatedConfig.navLogo = url;
      }
      if (files.footerLogo) {
          const url = await uploadFileToStorage(files.footerLogo, 'brand-assets', 'footer-logo');
          if (url) updatedConfig.footerLogo = url;
      }
      if (files.favicon) {
          const url = await uploadFileToStorage(files.favicon, 'brand-assets', 'favicon');
          if (url) updatedConfig.favicon = url;
      }
      if (files.heroImage) {
          const url = await uploadFileToStorage(files.heroImage, 'brand-assets', 'hero-bg');
          if (url && updatedConfig.hero) updatedConfig.hero.image = url;
      }
      if (files.heroVideo) {
          const url = await uploadFileToStorage(files.heroVideo, 'brand-assets', 'hero-video');
          if (url && updatedConfig.hero) (updatedConfig.hero as any).video = url;
      }
  }

  try {
    console.log('📤 [updateBrandConfig] Calling backend function...');
    
    const response = await fetch('/.netlify/functions/update-brand-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: updatedConfig,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Update failed:', errorData.error);
      return false;
    }

    const data = await response.json();
    console.log('✅ Brand config updated via backend');
    return data.success;
  } catch (error) {
    console.error('❌ Update exception:', error);
    return false;
  }
};

export const getServices = async (): Promise<Service[]> => {
  console.log('📤 [getServices] Fetching from Supabase...');
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('❌ [getServices] Error:', error);
    console.log('📤 [getServices] Returning CONSTANTS as fallback');
    return SERVICES_DATA;
  }

  if (!data || data.length === 0) {
    console.warn('⚠️ [getServices] No data from Supabase, returning CONSTANTS');
    return SERVICES_DATA;
  }

  console.log('✅ [getServices] Loaded', data.length, 'services from Supabase');
  return data as Service[];
};

export const updateServices = async (services: Service[]): Promise<boolean> => {
  const { error } = await supabase
    .from('services')
    .upsert(services);

  if (error) {
      console.error("Error updating services:", error);
      return false;
  }
  return true;
};

export const getConfiguratorItems = async (): Promise<ConfiguratorItem[]> => {
  console.log('📤 [getConfiguratorItems] Fetching from Supabase...');
  const { data, error } = await supabase
    .from('configurator_items')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('❌ [getConfiguratorItems] Error:', error);
    console.log('📤 [getConfiguratorItems] Returning CONSTANTS as fallback');
    return CONFIGURATOR_ITEMS;
  }

  if (!data || data.length === 0) {
    console.warn('⚠️ [getConfiguratorItems] No data from Supabase, returning CONSTANTS');
    return CONFIGURATOR_ITEMS;
  }

  console.log('✅ [getConfiguratorItems] Loaded', data.length, 'items from Supabase');
  return data as ConfiguratorItem[];
};

export const updateConfiguratorItemsOrder = async (items: ConfiguratorItem[]): Promise<boolean> => {
  const { error } = await supabase
    .from('configurator_items')
    .upsert(items);
  return !error;
};

export const saveConfiguratorItem = async (item: ConfiguratorItem): Promise<boolean> => {
  const { error } = await supabase
    .from('configurator_items')
    .upsert(item);
  return !error;
};

export const deleteConfiguratorItem = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('configurator_items')
    .delete()
    .eq('id', id);
  return !error;
};

export const getCustomSections = async (): Promise<DynamicSection[]> => {
  return [];
};

// =====================================================
// LEADS FUNCTIONS
// =====================================================

// ✅ Obtenir leads generals
export const getLeads = async (): Promise<LeadForm[]> => {
  console.log('📤 [getLeads] Fetching from Supabase...');
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ [getLeads] Error:', error);
    return [];
  }

  console.log('✅ [getLeads] Loaded', data?.length || 0, 'leads from Supabase');
  return data as LeadForm[] || [];
};

// ✅ Eliminar un lead
export const deleteLead = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('❌ [deleteLead] Error:', error);
    return false;
  }
  return true;
};

// =====================================================
// UTM TRACKING INTERFACE
// =====================================================
export interface UtmData {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  gclid?: string | null;
}

// ✅ Enviar un lead (amb suport UTM)
export const submitLead = async (data: LeadForm, utmData?: UtmData): Promise<{ success: boolean; error?: string }> => {
  // 🔧 La BD té camps en camelCase (fullName, serviceInterest)
  const insertData: Record<string, any> = {
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    company: data.company || null,
    serviceInterest: data.serviceInterest || null,
    message: data.message || null,
    created_at: new Date().toISOString(),
  };

  // UTM fields (només si tenen valor)
  if (utmData?.utm_source) insertData.utm_source = utmData.utm_source;
  if (utmData?.utm_medium) insertData.utm_medium = utmData.utm_medium;
  if (utmData?.utm_campaign) insertData.utm_campaign = utmData.utm_campaign;
  if (utmData?.utm_term) insertData.utm_term = utmData.utm_term;
  if (utmData?.utm_content) insertData.utm_content = utmData.utm_content;
  if (utmData?.gclid) insertData.gclid = utmData.gclid;

  console.log('📤 [submitLead] Submitting:', insertData);

  const { error } = await supabase
    .from('leads')
    .insert([insertData]);

  if (error) {
      console.error("Error submitting lead:", error);
      return { success: false, error: error.message };
  }
  
  // Enviar notificació per email
  try {
    const settings = await getNotificationSettings();
    if (settings.notifyOnLead && settings.emailRecipients?.length > 0) {
      await sendEmailNotification('lead', settings.emailRecipients, {
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        company: data.company,
        serviceInterest: data.serviceInterest,
        message: data.message,
        source: utmData?.utm_source || utmData?.gclid ? 'google_ads' : 'organic'
      });
    }
  } catch (notifError) {
    console.warn('⚠️ [submitLead] Notification failed:', notifError);
  }
  
  return { success: true };
};

// =====================================================
// CONFIGURATOR LEADS (Paquetes Personalizados)
// =====================================================

// ✅ Enviar configurator lead (amb suport UTM)
export const submitConfiguratorLead = async (leadData: Omit<ConfiguratorLead, 'id' | 'createdAt'>, utmData?: UtmData): Promise<{ success: boolean }> => {
  // 🔧 MAPPING: camelCase (codi) → lowercase (BD)
  const dbData = {
    email: leadData.email,
    selecteditems: leadData.selectedItems, // camelCase → lowercase
    created_at: new Date(),
    source: 'configurator',
    // UTM fields
    ...(utmData?.utm_source && { utm_source: utmData.utm_source }),
    ...(utmData?.utm_medium && { utm_medium: utmData.utm_medium }),
    ...(utmData?.utm_campaign && { utm_campaign: utmData.utm_campaign }),
    ...(utmData?.utm_term && { utm_term: utmData.utm_term }),
    ...(utmData?.utm_content && { utm_content: utmData.utm_content }),
    ...(utmData?.gclid && { gclid: utmData.gclid }),
  };

  console.log('📤 [submitConfiguratorLead] Submitting with UTM:', utmData);

  const { error } = await supabase
    .from('configurator_leads')
    .insert([dbData]);

  if (error) {
      console.error("Error submitting config lead:", error);
      return { success: false };
  }
  
  // Enviar notificació per email
  try {
    const settings = await getNotificationSettings();
    if (settings.notifyOnLead && settings.emailRecipients?.length > 0) {
      await sendEmailNotification('configurator', settings.emailRecipients, {
        email: leadData.email,
        selectedItems: leadData.selectedItems,
        source: utmData?.utm_source || utmData?.gclid ? 'google_ads' : 'organic'
      });
    }
  } catch (notifError) {
    console.warn('⚠️ [submitConfiguratorLead] Notification failed:', notifError);
  }
  
  return { success: true };
};

// ✅ Obtenir configurator leads
export const getConfiguratorLeads = async (): Promise<ConfiguratorLead[]> => {
  console.log('📤 [getConfiguratorLeads] Fetching from Supabase...');
  const { data, error } = await supabase
    .from('configurator_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ [getConfiguratorLeads] Error:', error);
    return [];
  }

  // 🔧 MAPPING: lowercase (BD) → camelCase (codi)
  const mapped = (data || []).map(item => ({
    id: item.id,
    email: item.email,
    selectedItems: item.selecteditems || [], // lowercase → camelCase
    createdAt: item.created_at
  }));

  console.log('✅ [getConfiguratorLeads] Loaded', mapped.length, 'configurator leads');
  return mapped as ConfiguratorLead[];
};

// ✅ Eliminar configurator lead
export const deleteConfiguratorLead = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('configurator_leads')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('❌ [deleteConfiguratorLead] Error:', error);
    return false;
  }
  return true;
};

// =====================================================
// BOT CONFIG
// =====================================================

export const getBotConfig = async (): Promise<BotConfig> => {
  const { data, error } = await supabase
    .from('bot_config')
    .select('*')
    .single();

  if (error || !data) {
      return {
          name: "NEXI_tech",
          tone: "professional" as const,
          responseLength: "balanced" as const,
          highlightedProduct: "Services",
          businessHoursStart: "09:00",
          businessHoursEnd: "18:00",
          timezone: "Europe/Madrid",
          limitations: [],
          qualifyingQuestions: [],
          customInstructions: "",
          knowledgeBase: []
      };
  }
  return data as BotConfig;
};

export const updateBotConfig = async (config: BotConfig): Promise<boolean> => {
   const { error } = await supabase
    .from('bot_config')
    .update(config)
    .eq('id', 1);
   return !error;
};

// =====================================================
// NOTIFICATION SETTINGS
// =====================================================

// ✅ Obtenir configuració notificacions
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
    console.log('📤 [getNotificationSettings] Fetching from Supabase...');
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .single();

    if (error || !data) {
        console.warn('⚠️ [getNotificationSettings] Error or no data:', error);
        return { emailRecipients: [], notifyOnLead: true, notifyOnConfigurator: true };
    }

    // 🔧 MAPPING: lowercase (BD) → camelCase (codi)
    const mapped: NotificationSettings = {
      emailRecipients: data.emailrecipients || [],      // lowercase → camelCase
      notifyOnLead: data.notifyonlead ?? true,          // lowercase → camelCase
      notifyOnConfigurator: data.notifyonconfigurator ?? true  // lowercase → camelCase
    };

    console.log('✅ [getNotificationSettings] Loaded:', mapped);
    return mapped;
};

// ✅ Actualitzar configuració notificacions
export const updateNotificationSettings = async (settings: NotificationSettings): Promise<boolean> => {
    console.log('📤 [updateNotificationSettings] Updating...', settings);
    
    // 🔧 MAPPING: camelCase (codi) → lowercase (BD)
    const dbData = {
      emailrecipients: settings.emailRecipients,        // camelCase → lowercase
      notifyonlead: settings.notifyOnLead,              // camelCase → lowercase
      notifyonconfigurator: settings.notifyOnConfigurator  // camelCase → lowercase
    };

    const { error } = await supabase
      .from('notification_settings')
      .update(dbData)
      .eq('id', 1);
    
    if (error) {
      console.error('❌ [updateNotificationSettings] Error:', error);
      return false;
    }
    
    console.log('✅ [updateNotificationSettings] Success');
    return true;
};

// =====================================================
// CATALOG LEADS (Descàrregues de Catàleg)
// =====================================================

export interface CatalogLead {
  id?: string;
  email: string;
  fullName?: string;
  phone?: string;
  company?: string;
  source: string;
  created_at?: string;
  // UTM fields
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  // Enrichment
  company_enrichment?: any;
  lead_score?: number;
}

// ✅ Enviar catalog lead (amb suport UTM i més camps)
export const submitCatalogLead = async (
  email: string, 
  source: string = 'footer',
  utmData?: UtmData,
  extraData?: { fullName?: string; phone?: string; company?: string }
): Promise<{ success: boolean }> => {
  console.log('📤 [submitCatalogLead] Submitting...', email, source, utmData);
  
  const insertData = {
    email,
    source,
    created_at: new Date().toISOString(),
    // Extra fields
    ...(extraData?.fullName && { fullname: extraData.fullName }),
    ...(extraData?.phone && { phone: extraData.phone }),
    ...(extraData?.company && { company: extraData.company }),
    // UTM fields
    ...(utmData?.utm_source && { utm_source: utmData.utm_source }),
    ...(utmData?.utm_medium && { utm_medium: utmData.utm_medium }),
    ...(utmData?.utm_campaign && { utm_campaign: utmData.utm_campaign }),
    ...(utmData?.utm_term && { utm_term: utmData.utm_term }),
    ...(utmData?.utm_content && { utm_content: utmData.utm_content }),
    ...(utmData?.gclid && { gclid: utmData.gclid }),
  };

  const { error } = await supabase
    .from('catalog_leads')
    .insert([insertData]);

  if (error) {
    console.error('❌ [submitCatalogLead] Error:', error);
    return { success: false };
  }
  
  // Enviar notificació per email
  try {
    const settings = await getNotificationSettings();
    if (settings.notifyOnLead && settings.emailRecipients?.length > 0) {
      await sendEmailNotification('catalog', settings.emailRecipients, { 
        email, 
        source,
        fullName: extraData?.fullName,
        company: extraData?.company
      });
    }
  } catch (notifError) {
    console.warn('⚠️ [submitCatalogLead] Notification failed:', notifError);
  }
  
  console.log('✅ [submitCatalogLead] Success');
  return { success: true };
};

// ✅ Obtenir catalog leads
export const getCatalogLeads = async (): Promise<CatalogLead[]> => {
  console.log('📤 [getCatalogLeads] Fetching from Supabase...');
  const { data, error } = await supabase
    .from('catalog_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ [getCatalogLeads] Error:', error);
    return [];
  }

  console.log('✅ [getCatalogLeads] Loaded', data?.length || 0, 'catalog leads');
  return data as CatalogLead[] || [];
};

// ✅ Eliminar catalog lead
export const deleteCatalogLead = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('catalog_leads')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('❌ [deleteCatalogLead] Error:', error);
    return false;
  }
  return true;
};

// =====================================================
// SOCIAL MEDIA CONFIG
// =====================================================

export interface SocialMediaConfig {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  catalogUrl?: string;
}

// ✅ Obtenir configuració social media (dins brand_config)
export const getSocialMediaConfig = async (): Promise<SocialMediaConfig> => {
  const { data, error } = await supabase
    .from('brand_config')
    .select('social_media, catalog_url')
    .single();

  if (error || !data) {
    console.warn('⚠️ [getSocialMediaConfig] Error or no data:', error);
    return {};
  }

  return {
    ...(data.social_media || {}),
    catalogUrl: data.catalog_url || 'https://drive.google.com/uc?export=download&id=1vweh1bRKZO7lpRudkzjoXDxzxc-s-SGm'
  };
};

// ✅ Actualitzar configuració social media
export const updateSocialMediaConfig = async (config: SocialMediaConfig): Promise<boolean> => {
  console.log('📤 [updateSocialMediaConfig] Updating...', config);

  const { catalogUrl, ...socialMedia } = config;

  const { error } = await supabase
    .from('brand_config')
    .update({
      social_media: socialMedia,
      catalog_url: catalogUrl
    })
    .eq('id', 1);

  if (error) {
    console.error('❌ [updateSocialMediaConfig] Error:', error);
    return false;
  }

  console.log('✅ [updateSocialMediaConfig] Success');
  return true;
};

// =====================================================
// CHATBOT LEADS
// =====================================================

export interface ChatbotLead {
  id: string;
  fullname: string | null;
  phone: string | null;
  email: string | null;
  company: string | null;
  proposed_date: string | null;
  proposed_time: string | null;
  interests: string[];
  conversation_summary: string | null;
  language: string;
  source: string;
  status: 'pending' | 'contacted' | 'converted' | 'dismissed';
  created_at: string;
  updated_at: string;
  // Nous camps qualificació
  tech_level: 'baix' | 'mig' | 'alt' | null;
  interest_level: 'fred' | 'tebi' | 'calent' | null;
  company_size: 'autonomo' | 'petita' | 'mitjana' | 'gran' | null;
  lead_score: number | null;
  qualification_notes: string | null;
  qualified_at: string | null;
  qualified_by: string | null;
}

export const getChatbotLeads = async (): Promise<ChatbotLead[]> => {
  const { data, error } = await supabase
    .from('chatbot_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching chatbot leads:', error);
    return [];
  }
  return data || [];
};

export const updateChatbotLeadStatus = async (id: string, status: string): Promise<boolean> => {
  const { error } = await supabase
    .from('chatbot_leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  return !error;
};

export const deleteChatbotLead = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('chatbot_leads')
    .delete()
    .eq('id', id);

  return !error;
};

// =====================================================
// UNIFIED LEADS (Vista unificada de tots els leads)
// =====================================================

export type LeadSource = 'contact-form' | 'configurator' | 'catalog' | 'chatbot';

export interface UnifiedLead {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  serviceInterest: string | null;
  source: LeadSource;
  sourceTable: 'leads' | 'configurator_leads' | 'catalog_leads' | 'chatbot_leads';
  status: string;
  created_at: string;
  // UTM / Campaign tracking
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  gclid: string | null;
  // Qualificació
  lead_score: number | null;
  interest_level: string | null;
  company_size: string | null;
  tech_level: string | null;
  // Enrichment
  company_enrichment: any | null;
  // Extra per cada tipus
  selectedItems?: any[];  // configurator
  proposed_date?: string | null;  // chatbot
  proposed_time?: string | null;  // chatbot
  conversation_summary?: string | null;  // chatbot
}

/**
 * Obté tots els leads de totes les fonts, unificats en un sol format
 */
export const getAllLeadsUnified = async (): Promise<UnifiedLead[]> => {
  console.log('📤 [getAllLeadsUnified] Fetching all leads...');

  const [leadsResult, configuratorResult, catalogResult, chatbotResult] = await Promise.all([
    supabase.from('leads').select('*').order('created_at', { ascending: false }),
    supabase.from('configurator_leads').select('*').order('created_at', { ascending: false }),
    supabase.from('catalog_leads').select('*').order('created_at', { ascending: false }),
    supabase.from('chatbot_leads').select('*').order('created_at', { ascending: false })
  ]);

  const unifiedLeads: UnifiedLead[] = [];

  // Mapejar leads del formulari de contacte
  if (leadsResult.data) {
    for (const lead of leadsResult.data) {
      unifiedLeads.push({
        id: lead.id,
        fullName: lead.fullname || lead.fullName || null,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        message: lead.message,
        serviceInterest: lead.serviceinterest || lead.serviceInterest || null,
        source: 'contact-form',
        sourceTable: 'leads',
        status: lead.status || 'new',
        created_at: lead.created_at,
        utm_source: lead.utm_source || null,
        utm_medium: lead.utm_medium || null,
        utm_campaign: lead.utm_campaign || null,
        gclid: lead.gclid || null,
        lead_score: lead.lead_score || null,
        interest_level: lead.interest_level || null,
        company_size: lead.company_size || null,
        tech_level: lead.tech_level || null,
        company_enrichment: lead.company_enrichment || null,
      });
    }
  }

  // Mapejar leads del configurador
  if (configuratorResult.data) {
    for (const lead of configuratorResult.data) {
      const items = lead.selecteditems || lead.selectedItems || [];
      unifiedLeads.push({
        id: lead.id,
        fullName: lead.fullname || lead.fullName || null,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        message: null,
        serviceInterest: `Paquete Personalizado (${items.length} items)`,
        source: 'configurator',
        sourceTable: 'configurator_leads',
        status: lead.status || 'pending',
        created_at: lead.created_at,
        utm_source: lead.utm_source || null,
        utm_medium: lead.utm_medium || null,
        utm_campaign: lead.utm_campaign || null,
        gclid: lead.gclid || null,
        lead_score: lead.lead_score || null,
        interest_level: lead.interest_level || null,
        company_size: lead.company_size || null,
        tech_level: lead.tech_level || null,
        company_enrichment: lead.company_enrichment || null,
        selectedItems: items,
      });
    }
  }

  // Mapejar leads de descàrrega de catàleg
  if (catalogResult.data) {
    for (const lead of catalogResult.data) {
      unifiedLeads.push({
        id: lead.id,
        fullName: lead.fullname || lead.fullName || null,
        email: lead.email,
        phone: lead.phone || null,
        company: lead.company || null,
        message: null,
        serviceInterest: 'Descàrrega Catàleg',
        source: 'catalog',
        sourceTable: 'catalog_leads',
        status: 'new',
        created_at: lead.created_at,
        utm_source: lead.utm_source || null,
        utm_medium: lead.utm_medium || null,
        utm_campaign: lead.utm_campaign || null,
        gclid: lead.gclid || null,
        lead_score: lead.lead_score || null,
        interest_level: null,
        company_size: null,
        tech_level: null,
        company_enrichment: lead.company_enrichment || null,
      });
    }
  }

  // Mapejar leads del chatbot
  if (chatbotResult.data) {
    for (const lead of chatbotResult.data) {
      unifiedLeads.push({
        id: lead.id,
        fullName: lead.fullname || null,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        message: lead.conversation_summary,
        serviceInterest: lead.interests?.join(', ') || 'Chatbot',
        source: 'chatbot',
        sourceTable: 'chatbot_leads',
        status: lead.status || 'pending',
        created_at: lead.created_at,
        utm_source: lead.utm_source || null,
        utm_medium: lead.utm_medium || null,
        utm_campaign: lead.utm_campaign || null,
        gclid: lead.gclid || null,
        lead_score: lead.lead_score || null,
        interest_level: lead.interest_level || null,
        company_size: lead.company_size || null,
        tech_level: lead.tech_level || null,
        company_enrichment: lead.company_enrichment || null,
        proposed_date: lead.proposed_date,
        proposed_time: lead.proposed_time,
        conversation_summary: lead.conversation_summary,
      });
    }
  }

  // Ordenar per data (més recents primer)
  unifiedLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  console.log('✅ [getAllLeadsUnified] Loaded', unifiedLeads.length, 'total leads');
  return unifiedLeads;
};

/**
 * Elimina un lead de qualsevol taula
 */
export const deleteUnifiedLead = async (id: string, sourceTable: UnifiedLead['sourceTable']): Promise<boolean> => {
  const { error } = await supabase
    .from(sourceTable)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`❌ [deleteUnifiedLead] Error deleting from ${sourceTable}:`, error);
    return false;
  }
  return true;
};

/**
 * Actualitza l'estat d'un lead
 */
export const updateUnifiedLeadStatus = async (
  id: string, 
  sourceTable: UnifiedLead['sourceTable'], 
  status: string
): Promise<boolean> => {
  const { error } = await supabase
    .from(sourceTable)
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error(`❌ [updateUnifiedLeadStatus] Error:`, error);
    return false;
  }
  return true;
};

/**
 * Actualitza la qualificació d'un lead (interest_level, company_size, tech_level)
 */
export const updateUnifiedLeadQualification = async (
  id: string, 
  sourceTable: UnifiedLead['sourceTable'], 
  qualification: {
    interest_level?: string;
    company_size?: string;
    tech_level?: string;
  }
): Promise<boolean> => {
  const { error } = await supabase
    .from(sourceTable)
    .update({ 
      ...qualification,
      updated_at: new Date().toISOString() 
    })
    .eq('id', id);

  if (error) {
    console.error(`❌ [updateUnifiedLeadQualification] Error:`, error);
    return false;
  }
  return true;
};

/**
 * Actualitza la cita acordada d'un lead del chatbot
 */
export const updateChatbotLeadAppointment = async (
  id: string, 
  proposed_date: string | null, 
  proposed_time: string | null
): Promise<boolean> => {
  console.log(`📅 [updateChatbotLeadAppointment] Updating lead ${id}:`, { proposed_date, proposed_time });
  
  const { error } = await supabase
    .from('chatbot_leads')
    .update({ 
      proposed_date, 
      proposed_time,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error(`❌ [updateChatbotLeadAppointment] Error:`, error);
    return false;
  }
  
  console.log(`✅ [updateChatbotLeadAppointment] Lead ${id} updated successfully`);
  return true;
};

// =====================================================
// LEGAL TEXTS (Textos legals editables)
// =====================================================

export interface LegalText {
  id: string;  // 'privacy', 'cookies', 'legal'
  title: Record<string, string>;
  content: Record<string, string>;
  last_updated?: string;
  updated_by?: string;
}

/**
 * Obté tots els textos legals
 */
export const getLegalTexts = async (): Promise<LegalText[]> => {
  console.log('📤 [getLegalTexts] Fetching...');
  
  const { data, error } = await supabase
    .from('legal_texts')
    .select('*');

  if (error) {
    console.error('❌ [getLegalTexts] Error:', error);
    return [];
  }

  console.log('✅ [getLegalTexts] Loaded', data?.length || 0, 'texts');
  return data || [];
};

/**
 * Obté un text legal per ID
 */
export const getLegalText = async (id: string): Promise<LegalText | null> => {
  console.log('📤 [getLegalText] Fetching:', id);
  
  const { data, error } = await supabase
    .from('legal_texts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('❌ [getLegalText] Error:', error);
    return null;
  }

  return data;
};

/**
 * Actualitza un text legal
 */
export const updateLegalText = async (
  id: string, 
  updates: { title?: Record<string, string>; content?: Record<string, string> }
): Promise<boolean> => {
  console.log('📤 [updateLegalText] Updating:', id);
  
  const { error } = await supabase
    .from('legal_texts')
    .update({
      ...updates,
      last_updated: new Date().toISOString(),
      updated_by: 'admin'
    })
    .eq('id', id);

  if (error) {
    console.error('❌ [updateLegalText] Error:', error);
    return false;
  }

  console.log('✅ [updateLegalText] Success');
  return true;
};
