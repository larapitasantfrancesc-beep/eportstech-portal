export type Language = 'es' | 'ca' | 'en' | 'fr' | 'de' | 'it';

export interface Translation {
  [key: string]: {
    [key in Language]: string;
  };
}

export interface Service {
  id: string;
  icon: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  category: string;
  // New fields for detailed view
  extendedDescription?: Record<Language, string>;
  features?: Record<Language, string[]>;
  // Management fields
  visible: boolean;
  sort_order: number;
}

export interface ConfiguratorItem {
  id: string;
  icon: string;
  category: ServiceCategory;
  title: Record<Language, string>;
  benefit: Record<Language, string>;
  description?: Record<Language, string>;
  // Management fields
  visible: boolean;
  sort_order: number;
}

export type RecommendationLevel = 'essential' | 'recommended' | 'optional';

export interface ConfiguratorItemResult extends ConfiguratorItem {
  level: RecommendationLevel;
  selected: boolean;
}

export interface WizardOption {
  id: string;
  label: Record<Language, string>;
  icon: string;
  value: string;
}

export interface WizardStep {
  id: 'size' | 'priority' | 'challenge';
  question: Record<Language, string>;
  subtitle: Record<Language, string>;
  options: WizardOption[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface LeadForm {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  serviceInterest: string;
  message: string;
  address?: string; // Optional for generic contact
  city?: string;    // Optional for generic contact
}

export interface ConfiguratorLead {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  selectedItems: ConfiguratorItem[]; // Full objects for display
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface HeroConfig {
  image: string;
  // 🎬 FASE 4: Camps de mèdia
  video?: string;                              // URL del vídeo (MP4/WebM)
  videoFallbackGif?: string;                   // URL del GIF de fallback
  mediaType?: 'video' | 'image' | 'auto';      // Tipus de mèdia a mostrar
  videoAutoplay?: boolean;                     // Reproduir automàticament (default: true)
  videoLoop?: boolean;                         // Reproduir en bucle (default: true)
  videoMuted?: boolean;                        // Silenciat (default: true, requerit per autoplay)
  // Configuració visual
  imagePosition: string;                       // 'center', 'top', 'bottom', 'left', 'right'
  overlayOpacity: number;                      // 0.1 to 1.0
  // Textos
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  ctaText: Record<Language, string>;
  tagline?: Record<Language, string>;          // Text editable del badge superior
}

export interface FooterConfig {
  copyrightText: Record<Language, string>;
  privacyText: Record<Language, string>;
  legalText: Record<Language, string>;
  cookiesText: Record<Language, string>;
}

export interface BenefitItemConfig {
    title: Record<Language, string>;
    description: Record<Language, string>;
}

export interface BenefitsConfig {
    mainTitle: Record<Language, string>;
    subtitle: Record<Language, string>;
    items: BenefitItemConfig[]; // Array of 4 items
}

export interface BrandConfig {
  siteName: string; // New field for Meta Title
  favicon: string;  // New field for Favicon URL
  navLogo: string;
  footerLogo: string;
  contactEmail: string;
  contactPhone: string;
  hero: HeroConfig;
  benefits: BenefitsConfig; // New field for editable content
  footer: FooterConfig;
  catalogUrl?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface NotificationSettings {
  emailRecipients: string[];
  notifyOnLead: boolean;
  notifyOnConfigurator: boolean;
}

export interface BotConfig {
  name: string;
  tone: 'professional' | 'friendly' | 'enthusiastic' | 'technical';
  responseLength: 'concise' | 'balanced' | 'detailed';
  highlightedProduct: string; // Product to push
  businessHoursStart: string; // "09:00"
  businessHoursEnd: string; // "18:00"
  timezone: string; // "Europe/Madrid"
  limitations: string[]; // What it cannot do
  qualifyingQuestions: string[]; // Questions to ask user
  customInstructions: string; // Extra text
  knowledgeBase: string[]; // Specific facts/knowledge for the bot
}

export interface GlobalSettings {
  texts: Translation;
  services: Service[];
  configuratorItems: ConfiguratorItem[];
  customSections: DynamicSection[];
}

export interface DynamicSection {
  id: string;
  title: Record<Language, string>;
  content: Record<Language, string>;
  sort_order: number;
}

export enum ServiceCategory {
  CONSULTING = 'consulting',
  CONNECTIVITY = 'connectivity',
  NETWORKING = 'networking',
  CYBERSECURITY = 'cybersecurity',
  IT_INFRASTRUCTURE = 'it_infrastructure',
  TELEPHONY = 'telephony',
  IOT = 'iot',
  SECURITY = 'security'
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
