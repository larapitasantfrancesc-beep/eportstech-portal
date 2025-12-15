import { supabase } from './supabaseClient';
import { LeadForm, BrandConfig, ConfiguratorLead, NotificationSettings, GlobalSettings, Service, ConfiguratorItem, DynamicSection, ServiceCategory, ConfiguratorItemResult, BotConfig, BenefitsConfig } from "../types";
import { TRANSLATIONS, SERVICES_DATA, CONFIGURATOR_ITEMS } from '../constants';

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
            copyrightText: { es: "© 2024", ca: "© 2024", en: "© 2024", fr: "© 2024", de: "© 2024", it: "© 2024" },
            privacyText: { es: "Privacidad", ca: "Privacitat", en: "Privacy", fr: "Confidentialité", de: "Datenschutz", it: "Privacy" },
            legalText: { es: "Legal", ca: "Legal", en: "Legal", fr: "Légal", de: "Rechtlich", it: "Legale" },
            cookiesText: { es: "Cookies", ca: "Cookies", en: "Cookies", fr: "Cookies", de: "Cookies", it: "Cookies" }
        }
    };
  }
  return data as BrandConfig;
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

export const submitLead = async (data: LeadForm): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase
    .from('leads')
    .insert([{ ...data, created_at: new Date() }]);

  if (error) {
      console.error("Error submitting lead:", error);
      return { success: false, error: error.message };
  }
  return { success: true };
};

export const submitConfiguratorLead = async (leadData: Omit<ConfiguratorLead, 'id' | 'createdAt'>): Promise<{ success: boolean }> => {
  const { error } = await supabase
    .from('configurator_leads')
    .insert([{ ...leadData, created_at: new Date() }]);

  if (error) {
      console.error("Error submitting config lead:", error);
      return { success: false };
  }
  return { success: true };
};

export const getConfiguratorLeads = async (): Promise<ConfiguratorLead[]> => {
  const { data, error } = await supabase
    .from('configurator_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data as unknown as ConfiguratorLead[];
};

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

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
    const { data, error } = await supabase
    .from('notification_settings')
    .select('*')
    .single();

    if(error || !data) {
        return { emailRecipients: [], notifyOnLead: true, notifyOnConfigurator: true };
    }
    return data as NotificationSettings;
};

export const updateNotificationSettings = async (settings: NotificationSettings): Promise<boolean> => {
    const { error } = await supabase
    .from('notification_settings')
    .update(settings)
    .eq('id', 1);
    return !error;
};
