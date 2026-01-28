
import React, { useState, useEffect } from 'react';
import {
  loginMock, logoutMock, checkAuth, getBrandConfig, updateBrandConfig,
  getConfiguratorLeads, getNotificationSettings, updateNotificationSettings,
  getServices, updateServices, getConfiguratorItems, saveConfiguratorItem, deleteConfiguratorItem, updateConfiguratorItemsOrder,
  getCustomSections, getBotConfig, updateBotConfig, getLeads, deleteLead, deleteConfiguratorLead,
  getCatalogLeads, deleteCatalogLead, CatalogLead, updateSocialMediaConfig, getSocialMediaConfig, SocialMediaConfig,
  getChatbotLeads, updateChatbotLeadStatus, deleteChatbotLead, ChatbotLead,
  // Noves funcions per leads unificats
  getAllLeadsUnified, deleteUnifiedLead, updateUnifiedLeadStatus, UnifiedLead, LeadSource,
  // Funció per actualitzar cita
  updateChatbotLeadAppointment,
  // Funcions per textos legals
  getLegalTexts, updateLegalText, LegalText
} from '../services/supabaseMock';
import {
  FileText, Settings, LogOut, Users, Database, Image as ImageIcon, Upload, Save,
  LayoutDashboard, ShoppingBag, Bell, Plus, Trash2, Edit2, CheckCircle, Languages, Monitor,
  AlignLeft, Move, MapPin, Phone, X, AlertTriangle, Clock, Zap, MessageSquare, BrainCircuit, Mic,
  Eye, EyeOff, ArrowUp, ArrowDown, BookOpen, Mail, Star, Globe, Lock, FileDown, Linkedin, Twitter, Facebook, Instagram, Youtube, Link,
  MessageSquareMore, Sparkles, Building2, Filter, TrendingUp, Target, Calendar, Scale, Check
} from 'lucide-react';
import { LeadForm, BrandConfig, ConfiguratorLead, NotificationSettings, Service, ConfiguratorItem, Language, DynamicSection, ServiceCategory, BotConfig } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants';
import { useLeadEnrichment } from '../hooks/useLeadEnrichment';
import { supabase } from '../services/supabaseClient';


const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState('leads');
  const [mockLeads, setMockLeads] = useState<LeadForm[]>([]);
  const [configuratorLeads, setConfiguratorLeads] = useState<ConfiguratorLead[]>([]);
  
  // Brand Kit State
  const [brandConfig, setBrandConfig] = useState<BrandConfig>({
      siteName: '',
      favicon: '',
      navLogo: '',
      footerLogo: '',
      contactEmail: '',
      contactPhone: '',
      hero: {
          image: '',
          imagePosition: 'center',
          overlayOpacity: 0.6,
          title: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
          subtitle: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
          ctaText: { es: '', ca: '', en: '', fr: '', de: '', it: '' }
      },
      benefits: {
         mainTitle: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
         subtitle: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
         items: []
      },
      footer: {
         copyrightText: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
         privacyText: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
         legalText: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
         cookiesText: { es: '', ca: '', en: '', fr: '', de: '', it: '' }
      }
  });
  
  // Store actual File objects to upload
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [heroEditLang, setHeroEditLang] = useState<Language>('es');

  // Configurator Items State
  const [configuratorItems, setConfiguratorItems] = useState<ConfiguratorItem[]>([]);
  const [editingItem, setEditingItem] = useState<ConfiguratorItem | null>(null);
  const [isEditingItemModalOpen, setIsEditingItemModalOpen] = useState(false);
  const [hasItemsChanges, setHasItemsChanges] = useState(false);
  const [isSavingItems, setIsSavingItems] = useState(false);

  // Bot Config State
  const [botConfig, setBotConfig] = useState<BotConfig | null>(null);
  const [newLimitation, setNewLimitation] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newKnowledgeItem, setNewKnowledgeItem] = useState('');

  // Settings State
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
      emailRecipients: [],
      notifyOnLead: true,
      notifyOnConfigurator: true
  });
  const [newEmail, setNewEmail] = useState('');

  // Services State
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [featuresText, setFeaturesText] = useState('');
  const [hasServicesChanges, setHasServicesChanges] = useState(false);
  const [isSavingServices, setIsSavingServices] = useState(false);

  // Sections State
  const [customSections, setCustomSections] = useState<DynamicSection[]>([]);

  // Catalog Leads State
  const [catalogLeads, setCatalogLeads] = useState<CatalogLead[]>([]);

  // Chatbot Leads State
  const [chatbotLeads, setChatbotLeads] = useState<ChatbotLead[]>([]);
  const { enrichLead, loading: enrichLoading } = useLeadEnrichment();
  const [selectedEnrichment, setSelectedEnrichment] = useState<any>(null);
  const [enrichmentModalOpen, setEnrichmentModalOpen] = useState(false);
  
  // Modal detalls lead complet
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<UnifiedLead | null>(null);
  const [leadDetailsModalOpen, setLeadDetailsModalOpen] = useState(false);
  
  // Edició de cita del lead
  const [editingAppointment, setEditingAppointment] = useState(false);
  const [editProposedDate, setEditProposedDate] = useState('');
  const [editProposedTime, setEditProposedTime] = useState('');
  const [savingAppointment, setSavingAppointment] = useState(false);

  // ✅ NOU: Leads Unificats State
  const [unifiedLeads, setUnifiedLeads] = useState<UnifiedLead[]>([]);
  const [leadSourceFilter, setLeadSourceFilter] = useState<LeadSource | 'all'>('all');
  const [leadCampaignFilter, setLeadCampaignFilter] = useState<string>('all');

  // Social Media Config State
  const [socialMediaConfig, setSocialMediaConfig] = useState<SocialMediaConfig>({
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    youtube: '',
    catalogUrl: ''
  });

  // ✅ NOU: Textos Legals State
  const [legalTexts, setLegalTexts] = useState<LegalText[]>([]);
  const [editingLegalId, setEditingLegalId] = useState<string | null>(null);
  const [legalEditLang, setLegalEditLang] = useState<Language>('es');
  const [isSavingLegal, setIsSavingLegal] = useState(false);

  useEffect(() => {
    const init = async () => {
       const auth = await checkAuth();
       setIsAuthenticated(auth);
       if (auth) {
           loadAllData();
       }
    };
    init();
  }, [isAuthenticated]);

  const loadAllData = async () => {
      // ✅ MODIFICAT: Carregar leads reals de Supabase
      const leadsData = await getLeads();
      setMockLeads(leadsData);

      const confLeads = await getConfiguratorLeads();
      setConfiguratorLeads(confLeads);

      let brand;
      try {
        brand = await getBrandConfig();
      } catch (error) {
        console.warn('Could not load brand config, using defaults:', error);
        brand = {
          siteName: '',
          favicon: '',
          navLogo: '',
          footerLogo: '',
          contactEmail: '',
          contactPhone: '',
          hero: {
            image: '',
            imagePosition: 'center',
            overlayOpacity: 0.6,
            title: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
            subtitle: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
            ctaText: { es: '', ca: '', en: '', fr: '', de: '', it: '' }
          },
          benefits: {
            mainTitle: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
            subtitle: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
            items: []
          },
          footer: {
            copyrightText: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
            privacyText: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
            legalText: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
            cookiesText: { es: '', ca: '', en: '', fr: '', de: '', it: '' }
          }
        };
      }
      
      if (!brand.footer) {
          brand.footer = {
             copyrightText: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
             privacyText: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
             legalText: { es: '', ca: '', en: '', fr: '', de: '', it: '' },
             cookiesText: { es: '', ca: '', en: '', fr: '', de: '', it: '' }
          };
      }
      if (!brand.hero.imagePosition) {
          brand.hero.imagePosition = 'center';
      }
      setBrandConfig(brand);

      const items = await getConfiguratorItems();
      setConfiguratorItems(items);

      const notif = await getNotificationSettings();
      setNotificationSettings(notif);

      const srvs = await getServices();
      setServices(srvs);

      const sects = await getCustomSections();
      setCustomSections(sects);

      const bConfig = await getBotConfig();
      setBotConfig(bConfig);

      // Carregar catalog leads
      const catLeads = await getCatalogLeads();
      setCatalogLeads(catLeads);

      // Carregar chatbot leads
      const chatLeads = await getChatbotLeads();
      setChatbotLeads(chatLeads);

      // ✅ NOU: Carregar tots els leads unificats
      const allLeads = await getAllLeadsUnified();
      setUnifiedLeads(allLeads);

      // Carregar social media config
      const socialConfig = await getSocialMediaConfig();
      setSocialMediaConfig(socialConfig);

      // ✅ NOU: Carregar textos legals
      const legals = await getLegalTexts();
      setLegalTexts(legals);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = await loginMock(password, email);
    if (success) {
        setIsAuthenticated(true);
    } else {
        setLoginError('Credenciales inválidas. Verifica tu email y contraseña.');
    }
  };

  const handleLogout = async () => {
    await logoutMock();
    setIsAuthenticated(false);
  };

  const viewEnrichmentDetails = async (leadId: string, tableName: string = 'chatbot_leads') => {
    const { data } = await supabase
      .from(tableName)
      .select('company_enrichment')
      .eq('id', leadId)
      .single();

    if (data?.company_enrichment) {
      setSelectedEnrichment(data.company_enrichment);
      setEnrichmentModalOpen(true);
    } else {
      alert('Aquest lead encara no té dades d\'enrichment');
    }
  };

  // --- BRAND HANDLERS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'nav' | 'footer' | 'hero' | 'favicon') => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          // Create object URL for preview
          const url = URL.createObjectURL(file);
          
          // Store file for upload later
          const fileKey = type === 'hero' ? 'heroImage' : type === 'nav' ? 'navLogo' : type === 'footer' ? 'footerLogo' : 'favicon';
          setPendingFiles(prev => ({ ...prev, [fileKey]: file }));

          if (type === 'hero') {
              setBrandConfig(prev => ({ ...prev, hero: { ...prev.hero, image: url } }));
          } else if (type === 'nav') {
              setBrandConfig(prev => ({ ...prev, navLogo: url }));
          } else if (type === 'favicon') {
              setBrandConfig(prev => ({ ...prev, favicon: url }));
          } else {
              setBrandConfig(prev => ({ ...prev, footerLogo: url }));
          }
      }
  };

  const handleHeroTextChange = (field: 'title' | 'subtitle' | 'ctaText' | 'tagline', value: string) => {
      setBrandConfig(prev => ({
          ...prev,
          hero: {
              ...prev.hero,
              [field]: {
                  ...(prev.hero as any)[field],
                  [heroEditLang]: value
              }
          }
      }));
  };

  const handleFooterTextChange = (field: 'privacyText' | 'legalText' | 'cookiesText' | 'copyrightText', value: string) => {
      setBrandConfig(prev => ({
          ...prev,
          footer: {
              ...prev.footer,
              [field]: {
                  ...prev.footer[field],
                  [heroEditLang]: value
              }
          }
      }));
  };

  const handleBenefitsMainChange = (field: 'mainTitle' | 'subtitle', value: string) => {
       setBrandConfig(prev => ({
          ...prev,
          benefits: {
              ...prev.benefits,
              [field]: {
                  ...prev.benefits[field],
                  [heroEditLang]: value
              }
          }
      }));
  };

  const handleBenefitItemChange = (index: number, field: 'title' | 'description', value: string) => {
      const newItems = [...(brandConfig.benefits.items || [])];
      // Ensure item exists
      if (!newItems[index]) {
          newItems[index] = { title: { es: '', ca: '', en: '', fr: '', de: '', it: '' }, description: { es: '', ca: '', en: '', fr: '', de: '', it: '' } };
      }
      newItems[index] = {
          ...newItems[index],
          [field]: {
              ...newItems[index][field],
              [heroEditLang]: value
          }
      };
      
      setBrandConfig(prev => ({
          ...prev,
          benefits: {
              ...prev.benefits,
              items: newItems
          }
      }));
  };

  const saveBrandConfigHandler = async () => {
      setIsSavingBrand(true);
      // Pass pendingFiles to upload
      const success = await updateBrandConfig(brandConfig, pendingFiles);
      if (success) {
          setPendingFiles({}); // Clear pending files after successful upload
          alert('Configuración guardada y archivos subidos correctamente');
      } else {
          alert('Error al guardar. Revisa la consola o tu conexión.');
      }
      setIsSavingBrand(false);
  };

  // --- SETTINGS HANDLERS ---
  const addEmail = () => {
      if (newEmail && !notificationSettings.emailRecipients.includes(newEmail)) {
          const updated = { ...notificationSettings, emailRecipients: [...notificationSettings.emailRecipients, newEmail] };
          setNotificationSettings(updated);
          updateNotificationSettings(updated);
          setNewEmail('');
      }
  };
  
  const removeEmail = (email: string) => {
      const updated = { ...notificationSettings, emailRecipients: notificationSettings.emailRecipients.filter(e => e !== email) };
      setNotificationSettings(updated);
      updateNotificationSettings(updated);
  };

  // --- SERVICE HANDLERS ---
  const handleEditService = (service: Service) => {
      setEditingService({...service});
      const feats = service.features?.[heroEditLang] || [];
      setFeaturesText(feats.join('\n'));
      setIsServiceModalOpen(true);
  };

  useEffect(() => {
      if (editingService) {
          const feats = editingService.features?.[heroEditLang] || [];
          setFeaturesText(feats.join('\n'));
      }
  }, [heroEditLang, editingService?.id]);
  
  const saveServiceHandler = async () => {
      if (editingService) {
          const featuresArray = featuresText.split('\n').filter(line => line.trim() !== '');
          const updatedService = {
              ...editingService,
              features: {
                  ...editingService.features,
                  [heroEditLang]: featuresArray
              } as Record<Language, string[]>
          };

          const updatedList = services.map(s => s.id === updatedService.id ? updatedService : s);
          setServices(updatedList);
          await updateServices(updatedList);
          setIsServiceModalOpen(false);
          setEditingService(null);
      }
  };

  const toggleServiceVisibility = (service: Service) => {
      const updatedService = { ...service, visible: !service.visible };
      const updatedList = services.map(s => s.id === service.id ? updatedService : s);
      setServices(updatedList);
      setHasServicesChanges(true);
  };

  // Handler per guardar tots els canvis de serveis
  const saveServicesHandler = async () => {
      setIsSavingServices(true);
      const success = await updateServices(services);
      if (success) {
          setHasServicesChanges(false);
          alert('Servicios actualizados correctamente');
      } else {
          alert('Error al guardar los servicios');
      }
      setIsSavingServices(false);
  };

  const moveService = (index: number, direction: 'up' | 'down') => {
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === services.length - 1)) return;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const newServices = [...services];
      [newServices[index], newServices[newIndex]] = [newServices[newIndex], newServices[index]];
      
      // Update sort_order property locally (save with button)
      newServices.forEach((s, idx) => (s as any).sort_order = idx);
      
      setServices(newServices);
      setHasServicesChanges(true);
  };

  // --- CONFIGURATOR ITEM HANDLERS ---
  const handleAddNewItem = () => {
      setEditingItem({
          id: Date.now().toString(),
          icon: 'Box',
          category: ServiceCategory.CONSULTING,
          title: { es: 'Nuevo Servicio', ca: '', en: '', fr: '', de: '', it: '' },
          benefit: { es: 'Beneficio principal', ca: '', en: '', fr: '', de: '', it: '' },
          visible: true,
          sort_order: configuratorItems.length
      } as any);
      setIsEditingItemModalOpen(true);
  };

  const handleEditItem = (item: ConfiguratorItem) => {
      setEditingItem({...item});
      setIsEditingItemModalOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
      if(window.confirm('¿Estás seguro de eliminar este item?')) {
          await deleteConfiguratorItem(id);
          setConfiguratorItems(prev => prev.filter(i => i.id !== id));
      }
  };

  const saveConfiguratorItemHandler = async () => {
      if (editingItem) {
          await saveConfiguratorItem(editingItem);
          const items = await getConfiguratorItems();
          setConfiguratorItems(items);
          setIsEditingItemModalOpen(false);
          setEditingItem(null);
      }
  };

  const toggleItemVisibility = (item: ConfiguratorItem) => {
      const updatedItem = { ...item, visible: !item.visible };
      setConfiguratorItems(prev => prev.map(i => i.id === item.id ? updatedItem : i));
      setHasItemsChanges(true);
  };

  // Handler per guardar tots els canvis d'items
  const saveItemsHandler = async () => {
      setIsSavingItems(true);
      const success = await updateConfiguratorItemsOrder(configuratorItems);
      if (success) {
          setHasItemsChanges(false);
          alert('Items actualizados correctamente');
      } else {
          alert('Error al guardar los items');
      }
      setIsSavingItems(false);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === configuratorItems.length - 1)) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...configuratorItems];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    
    // Update sort_order property locally (save with button)
    newItems.forEach((item, idx) => (item as any).sort_order = idx);

    setConfiguratorItems(newItems);
    setHasItemsChanges(true);
  };

  // --- BOT HANDLERS ---
  const handleBotChange = (field: keyof BotConfig, value: any) => {
      if (botConfig) {
          setBotConfig({ ...botConfig, [field]: value });
      }
  };

  const addLimitation = () => {
      if (botConfig && newLimitation) {
          setBotConfig({ ...botConfig, limitations: [...botConfig.limitations, newLimitation] });
          setNewLimitation('');
      }
  };

  const removeLimitation = (idx: number) => {
      if (botConfig) {
          setBotConfig({ ...botConfig, limitations: botConfig.limitations.filter((_, i) => i !== idx) });
      }
  };

  const addQuestion = () => {
      if (botConfig && newQuestion) {
          setBotConfig({ ...botConfig, qualifyingQuestions: [...botConfig.qualifyingQuestions, newQuestion] });
          setNewQuestion('');
      }
  };

  const removeQuestion = (idx: number) => {
      if (botConfig) {
          setBotConfig({ ...botConfig, qualifyingQuestions: botConfig.qualifyingQuestions.filter((_, i) => i !== idx) });
      }
  };

  const addKnowledgeItem = () => {
      if (botConfig && newKnowledgeItem) {
          setBotConfig({ ...botConfig, knowledgeBase: [...(botConfig.knowledgeBase || []), newKnowledgeItem] });
          setNewKnowledgeItem('');
      }
  };

  const removeKnowledgeItem = (idx: number) => {
      if (botConfig) {
          setBotConfig({ ...botConfig, knowledgeBase: (botConfig.knowledgeBase || []).filter((_, i) => i !== idx) });
      }
  };

  const saveBotConfigHandler = async () => {
      if (botConfig) {
          await updateBotConfig(botConfig);
          alert('Configuración del Chatbot actualizada.');
      }
  };


  // --- RENDER ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary-900">EportsTech Admin</h2>
              <p className="text-xs text-gray-400 mt-2">Acceso seguro vía Supabase</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Corporativo</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="admin@eportstech.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            
            <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 flex items-center justify-center gap-2">
              <Lock size={16} /> Entrar al Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ... (The rest of the component remains largely identical in structure to the previous mock version, just using the new state/handlers)
  // To keep the file concise, I'm returning the full structure but using the variables defined above.
  
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-900 text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-primary-800">
           <h1 className="text-xl font-bold">Admin Portal</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => setActiveTab('leads')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'leads' ? 'bg-primary-700' : 'hover:bg-primary-800'}`}>
            <Users size={20} /> <span>Centre de Leads</span>
            {unifiedLeads.length > 0 && (
              <span className="ml-auto bg-primary-600 text-xs px-2 py-0.5 rounded-full">{unifiedLeads.length}</span>
            )}
          </button>
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-primary-400 uppercase">CMS</div>
          <button onClick={() => setActiveTab('brand')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'brand' ? 'bg-primary-700' : 'hover:bg-primary-800'}`}>
            <Monitor size={20} /> <span>Kit de Marca & Hero</span>
          </button>
          <button onClick={() => setActiveTab('services')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'services' ? 'bg-primary-700' : 'hover:bg-primary-800'}`}>
            <LayoutDashboard size={20} /> <span>Gestor de Servicios</span>
          </button>
          <button onClick={() => setActiveTab('configurator')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'configurator' ? 'bg-primary-700' : 'hover:bg-primary-800'}`}>
            <Settings size={20} /> <span>Configurador Items</span>
          </button>
          <button onClick={() => setActiveTab('social')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'social' ? 'bg-primary-700' : 'hover:bg-primary-800'}`}>
            <Link size={20} /> <span>Redes Sociales</span>
          </button>
          <button onClick={() => setActiveTab('footer')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'footer' ? 'bg-primary-700' : 'hover:bg-primary-800'}`}>
            <AlignLeft size={20} /> <span>Textos Footer</span>
          </button>
          <button onClick={() => setActiveTab('legal')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'legal' ? 'bg-primary-700' : 'hover:bg-primary-800'}`}>
            <Scale size={20} /> <span>Textos Legals</span>
          </button>
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-primary-400 uppercase">Config</div>
          <button onClick={() => setActiveTab('bot')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'bot' ? 'bg-primary-700' : 'hover:bg-primary-800'}`}>
             <Database size={20} /> <span>Chatbot AI</span>
           </button>
           <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary-700' : 'hover:bg-primary-800'}`}>
             <Bell size={20} /> <span>Notificaciones</span>
           </button>
        </nav>
        <div className="p-4 border-t border-primary-800">
          <button onClick={handleLogout} className="flex items-center gap-2 text-primary-200 hover:text-white">
            <LogOut size={18} /> <span>Salir</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-64 overflow-y-auto">
        
        {/* === BRAND KIT & HERO MANAGER === */}
        {activeTab === 'brand' && (
          <div className="animate-fade-in space-y-8 max-w-5xl">
             <div className="flex justify-between items-center sticky top-0 bg-gray-50 z-20 py-4 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800">Gestor de Marca y Portada</h2>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
                      <Languages size={18} className="text-gray-500" />
                      <select 
                          value={heroEditLang}
                          onChange={(e) => setHeroEditLang(e.target.value as Language)}
                          className="text-sm border-none focus:ring-0 bg-transparent"
                      >
                          {SUPPORTED_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                      </select>
                  </div>
                  <button 
                      onClick={saveBrandConfigHandler}
                      disabled={isSavingBrand}
                      className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                      {isSavingBrand ? <Settings className="animate-spin" size={18} /> : <Save size={18} />}
                      <span>{isSavingBrand ? 'Subiendo...' : 'Guardar Cambios'}</span>
                  </button>
                </div>
            </div>
            
            {/* GENERAL SITE CONFIG (Favicon & Title) */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-slate-900 px-6 py-4 border-b border-slate-700">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Globe size={24} className="text-cyan-400" /> Configuración General del Sitio
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Sitio (Pestaña del Navegador)</label>
                        <input 
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            value={brandConfig.siteName || ''}
                            onChange={(e) => setBrandConfig({...brandConfig, siteName: e.target.value})}
                            placeholder="EportsTech | Soluciones"
                        />
                        <p className="text-xs text-gray-400 mt-1">Este es el título que aparece en Google y en la pestaña.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Favicon (Icono Pestaña)</label>
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                                {brandConfig.favicon ? (
                                    <img src={brandConfig.favicon} alt="Favicon" className="w-8 h-8 object-contain" />
                                ) : <span className="text-xs text-gray-400">Sin icono</span>}
                             </div>
                             <label className="cursor-pointer bg-white shadow-sm border border-gray-200 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                                 <Upload size={16} /> Subir Favicon
                                 <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'favicon')} />
                             </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTACT INFO */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-slate-900 px-6 py-4 border-b border-slate-700">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Phone size={24} className="text-yellow-400" /> Información de Contacto
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Mail size={16}/> Email de Contacto Público</label>
                        <input 
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            value={brandConfig.contactEmail || ''}
                            onChange={(e) => setBrandConfig({...brandConfig, contactEmail: e.target.value})}
                            placeholder="contacto@empresa.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Phone size={16}/> Teléfono de Contacto Público</label>
                        <input 
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            value={brandConfig.contactPhone || ''}
                            onChange={(e) => setBrandConfig({...brandConfig, contactPhone: e.target.value})}
                            placeholder="+34 900 ..."
                        />
                    </div>
                </div>
            </div>

            {/* HERO SECTION MANAGER */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-700">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Monitor size={24} className="text-blue-400" />
                        Sección Hero (Portada)
                    </h3>
                </div>
                
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Visual Settings */}
                    <div className="space-y-6">
                        {/* 🎬 TIPUS DE MÈDIA */}
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                            <label className="block text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                🎬 Tipus de Fons
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 'auto', label: 'Auto', desc: 'Detecta connexió' },
                                    { value: 'video', label: 'Vídeo', desc: 'Sempre vídeo' },
                                    { value: 'image', label: 'Imatge', desc: 'Sempre imatge' }
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setBrandConfig(prev => ({ 
                                            ...prev, 
                                            hero: { ...prev.hero, mediaType: opt.value as any } 
                                        }))}
                                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                                            (brandConfig.hero as any).mediaType === opt.value || (!((brandConfig.hero as any).mediaType) && opt.value === 'auto')
                                                ? 'border-purple-500 bg-purple-100 text-purple-800'
                                                : 'border-gray-200 bg-white hover:border-purple-300'
                                        }`}
                                    >
                                        <span className="font-medium block">{opt.label}</span>
                                        <span className="text-xs text-gray-500">{opt.desc}</span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-purple-600 mt-2">
                                ℹ️ "Auto" mostra vídeo en connexions ràpides i imatge en connexions lentes.
                            </p>
                        </div>

                        {/* UPLOAD/URL VÍDEO */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                🎥 Vídeo de Fons (MP4/WebM)
                            </label>
                            
                            {/* Botó Upload */}
                            <div className="flex gap-2 mb-2">
                                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-50 border-2 border-dashed border-primary-300 rounded-lg cursor-pointer hover:bg-primary-100 transition-colors">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="video/mp4,video/webm"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                const url = URL.createObjectURL(file);
                                                setPendingFiles(prev => ({ ...prev, heroVideo: file }));
                                                setBrandConfig(prev => ({ 
                                                    ...prev, 
                                                    hero: { ...prev.hero, video: url } 
                                                }));
                                            }
                                        }}
                                    />
                                    <Upload size={18} className="text-primary-600" />
                                    <span className="text-sm font-medium text-primary-700">Pujar Vídeo</span>
                                </label>
                                {(brandConfig.hero as any).video && (
                                    <button
                                        onClick={() => {
                                            setBrandConfig(prev => ({ 
                                                ...prev, 
                                                hero: { ...prev.hero, video: '' } 
                                            }));
                                            setPendingFiles(prev => {
                                                const { heroVideo, ...rest } = prev;
                                                return rest;
                                            });
                                        }}
                                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        title="Eliminar vídeo"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                            
                            {/* URL Manual (opcional) */}
                            <details className="mt-2">
                                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                                    O introdueix URL manualment...
                                </summary>
                                <input
                                    type="url"
                                    placeholder="https://example.com/hero-video.mp4"
                                    value={(brandConfig.hero as any).video || ''}
                                    onChange={(e) => setBrandConfig(prev => ({ 
                                        ...prev, 
                                        hero: { ...prev.hero, video: e.target.value } 
                                    }))}
                                    className="w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                                />
                            </details>
                            
                            {(brandConfig.hero as any).video && (
                                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                    <Check size={12} /> Vídeo configurat
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Recomanat: MP4 H.264, màx 50MB, 1920x1080</p>
                        </div>

                        {/* URL GIF FALLBACK */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                🖼️ URL del GIF (Fallback)
                            </label>
                            <input
                                type="url"
                                placeholder="https://example.com/hero-fallback.gif"
                                value={(brandConfig.hero as any).videoFallbackGif || ''}
                                onChange={(e) => setBrandConfig(prev => ({ 
                                    ...prev, 
                                    hero: { ...prev.hero, videoFallbackGif: e.target.value } 
                                }))}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">S'usa si el vídeo no carrega o en connexions lentes</p>
                        </div>

                        {/* OPCIONS DE VÍDEO */}
                        {((brandConfig.hero as any).video || (brandConfig.hero as any).mediaType === 'video') && (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">⚙️ Opcions de Vídeo</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={(brandConfig.hero as any).videoAutoplay !== false}
                                            onChange={(e) => setBrandConfig(prev => ({ 
                                                ...prev, 
                                                hero: { ...prev.hero, videoAutoplay: e.target.checked } 
                                            }))}
                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">Reproducció automàtica</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={(brandConfig.hero as any).videoLoop !== false}
                                            onChange={(e) => setBrandConfig(prev => ({ 
                                                ...prev, 
                                                hero: { ...prev.hero, videoLoop: e.target.checked } 
                                            }))}
                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">Reproduir en bucle</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={(brandConfig.hero as any).videoMuted !== false}
                                            onChange={(e) => setBrandConfig(prev => ({ 
                                                ...prev, 
                                                hero: { ...prev.hero, videoMuted: e.target.checked } 
                                            }))}
                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">Silenciat (requerit per autoplay)</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* IMATGE DE FONS (FALLBACK FINAL) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">📷 Imatge de Fons (Fallback)</label>
                            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 group">
                                {/* Preview: Vídeo o Imatge */}
                                {(brandConfig.hero as any).video && (brandConfig.hero as any).mediaType !== 'image' ? (
                                    <video
                                        src={(brandConfig.hero as any).video}
                                        className="w-full h-full object-cover"
                                        style={{ objectPosition: brandConfig.hero.imagePosition }}
                                        muted
                                        loop
                                        autoPlay
                                        playsInline
                                    />
                                ) : (
                                    <img 
                                        src={brandConfig.hero.image} 
                                        alt="Hero Preview" 
                                        className="w-full h-full object-cover" 
                                        style={{ objectPosition: brandConfig.hero.imagePosition }}
                                    />
                                )}
                                {/* Overlay Preview */}
                                <div 
                                    className="absolute inset-0 pointer-events-none transition-colors duration-300"
                                    style={{ backgroundColor: `rgba(15, 23, 42, ${brandConfig.hero.overlayOpacity})` }}
                                ></div>

                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2">
                                        <Upload size={18} /> Canviar Imatge
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'hero')} />
                                    </label>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Aquesta imatge es mostra si el vídeo/GIF no carrega</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Move size={16} /> Alineació del Mèdia
                            </label>
                            <select 
                                value={brandConfig.hero.imagePosition}
                                onChange={(e) => setBrandConfig(prev => ({ ...prev, hero: { ...prev.hero, imagePosition: e.target.value } }))}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                                <option value="center">Centre (Per defecte)</option>
                                <option value="top">Amunt (Top)</option>
                                <option value="bottom">Avall (Bottom)</option>
                                <option value="left">Esquerra (Left)</option>
                                <option value="right">Dreta (Right)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Opacitat del Filtre (Overlay): {Math.round(brandConfig.hero.overlayOpacity * 100)}%
                            </label>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.1" 
                                value={brandConfig.hero.overlayOpacity}
                                onChange={(e) => setBrandConfig(prev => ({ ...prev, hero: { ...prev.hero, overlayOpacity: parseFloat(e.target.value) } }))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Text Settings */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                <FileText size={18} /> Textos ({heroEditLang.toUpperCase()})
                            </h4>
                        </div>

                        <div className="space-y-4">
                            {/* ✅ NOU: Tagline editable */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Etiqueta Superior (Tagline)</label>
                                <input 
                                    type="text"
                                    placeholder="Ej: Soluciones Empresariales"
                                    value={(brandConfig.hero as any).tagline?.[heroEditLang] || ''}
                                    onChange={(e) => handleHeroTextChange('tagline' as any, e.target.value)}
                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                />
                                <p className="text-xs text-gray-400 mt-1">Text que apareix al badge sobre el títol</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Título Principal</label>
                                <input 
                                    type="text"
                                    value={brandConfig.hero.title[heroEditLang] || ''}
                                    onChange={(e) => handleHeroTextChange('title', e.target.value)}
                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Subtítulo</label>
                                <textarea 
                                    rows={3}
                                    value={brandConfig.hero.subtitle[heroEditLang] || ''}
                                    onChange={(e) => handleHeroTextChange('subtitle', e.target.value)}
                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Texto Botón CTA</label>
                                <input 
                                    type="text"
                                    value={brandConfig.hero.ctaText[heroEditLang] || ''}
                                    onChange={(e) => handleHeroTextChange('ctaText', e.target.value)}
                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BENEFITS SECTION (New) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-slate-900 px-6 py-4 border-b border-slate-700">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Star size={24} className="text-orange-400" /> Sección Beneficios ({heroEditLang})
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título Sección</label>
                            <input 
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                value={brandConfig.benefits?.mainTitle?.[heroEditLang] || ''}
                                onChange={(e) => handleBenefitsMainChange('mainTitle', e.target.value)}
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtítulo Sección</label>
                            <input 
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                value={brandConfig.benefits?.subtitle?.[heroEditLang] || ''}
                                onChange={(e) => handleBenefitsMainChange('subtitle', e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <h4 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Items de Valor (4 Bloques)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[0, 1, 2, 3].map((idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-xs font-bold text-primary-600 uppercase mb-1">Beneficio {idx + 1} - Título</label>
                                <input 
                                    className="w-full border-gray-300 rounded-md shadow-sm mb-3 text-sm"
                                    value={brandConfig.benefits?.items?.[idx]?.title?.[heroEditLang] || ''}
                                    onChange={(e) => handleBenefitItemChange(idx, 'title', e.target.value)}
                                />
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Beneficio {idx + 1} - Descripción</label>
                                <textarea 
                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                                    rows={2}
                                    value={brandConfig.benefits?.items?.[idx]?.description?.[heroEditLang] || ''}
                                    onChange={(e) => handleBenefitItemChange(idx, 'description', e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* LOGOS SECTION */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-slate-900 px-6 py-4 border-b border-slate-700">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <ImageIcon size={24} className="text-pink-400" /> Identidad Visual
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Nav Logo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo Barra de Navegación</label>
                        <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 h-40 relative group">
                             {brandConfig.navLogo ? (
                                <img src={brandConfig.navLogo} alt="Nav Logo" className="h-12 object-contain" />
                             ) : <span className="text-gray-400">Sin logo</span>}
                             <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <label className="cursor-pointer bg-white shadow-sm border border-gray-200 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-50">
                                     Subir
                                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'nav')} />
                                 </label>
                             </div>
                        </div>
                    </div>
                    {/* Footer Logo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo Pie de Página</label>
                        <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-800 h-40 relative group">
                             {brandConfig.footerLogo ? (
                                <img src={brandConfig.footerLogo} alt="Footer Logo" className="h-12 object-contain" />
                             ) : <span className="text-gray-500">Sin logo</span>}
                             <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <label className="cursor-pointer bg-white shadow-sm border border-gray-200 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-50">
                                     Subir
                                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'footer')} />
                                 </label>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER TEXTS SECTION */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-slate-900 px-6 py-4 border-b border-slate-700">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <AlignLeft size={24} className="text-green-400" /> Pie de Página (Footer)
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Copyright Text ({heroEditLang})</label>
                            <input 
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                value={brandConfig.footer.copyrightText[heroEditLang] || ''}
                                onChange={(e) => handleFooterTextChange('copyrightText', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Enlace Privacidad ({heroEditLang})</label>
                            <input 
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                value={brandConfig.footer.privacyText[heroEditLang] || ''}
                                onChange={(e) => handleFooterTextChange('privacyText', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Enlace Legal ({heroEditLang})</label>
                            <input 
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                value={brandConfig.footer.legalText[heroEditLang] || ''}
                                onChange={(e) => handleFooterTextChange('legalText', e.target.value)}
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Enlace Cookies ({heroEditLang})</label>
                            <input 
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                value={brandConfig.footer.cookiesText[heroEditLang] || ''}
                                onChange={(e) => handleFooterTextChange('cookiesText', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* === SERVICES MANAGER === */}
        {activeTab === 'services' && (
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Gestor de Servicios</h2>
                    <p className="text-gray-500 text-sm">Gestiona la visibilidad, orden y contenido de tus servicios.</p>
                </div>
                
                {services.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-xl border border-dashed text-gray-500">
                        Cargando servicios o Base de datos vacía...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                            <div key={service.id} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between transition-opacity ${service.visible ? 'border-gray-200 opacity-100' : 'border-gray-100 opacity-60 bg-gray-50'}`}>
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                                            {/* @ts-ignore */}
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex gap-2">
                                             <button 
                                                onClick={() => moveService(index, 'up')}
                                                disabled={index === 0}
                                                className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                                                title="Mover Arriba"
                                             >
                                                <ArrowUp size={16} />
                                             </button>
                                             <button 
                                                onClick={() => moveService(index, 'down')}
                                                disabled={index === services.length - 1}
                                                className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                                                title="Mover Abajo"
                                             >
                                                <ArrowDown size={16} />
                                             </button>
                                             <button 
                                                onClick={() => toggleServiceVisibility(service)}
                                                className={`p-1 ${service.visible ? 'text-green-500 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                                                title={service.visible ? "Ocultar Servicio" : "Mostrar Servicio"}
                                             >
                                                {service.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                             </button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">{service.title['es']}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{service.description['es']}</p>
                                </div>
                                <button 
                                    onClick={() => handleEditService(service)}
                                    className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Edit2 size={16} /> Editar Detalles
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Botó Guardar Canvis Serveis */}
                {hasServicesChanges && (
                    <div className="mt-6 flex justify-end">
                        <button 
                            onClick={saveServicesHandler}
                            disabled={isSavingServices}
                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {isSavingServices ? (
                                <><Clock size={18} className="animate-spin" /> Guardando...</>
                            ) : (
                                <><Save size={18} /> Guardar Cambios</>
                            )}
                        </button>
                    </div>
                )}
                
                {/* Modal for Service Editing (Service editing implementation details omitted for brevity, logic handled above) */}
                {isServiceModalOpen && editingService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-lg">Editar Servicio: {editingService.title['es']}</h3>
                                <button onClick={() => setIsServiceModalOpen(false)}><X size={24} className="text-gray-500" /></button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                    {SUPPORTED_LANGUAGES.map(lang => (
                                        <button 
                                            key={lang.code}
                                            onClick={() => {
                                                const currentFeats = featuresText.split('\n').filter(l => l.trim() !== '');
                                                const updated = {
                                                    ...editingService,
                                                    features: { ...editingService.features, [heroEditLang]: currentFeats } as any
                                                };
                                                setEditingService(updated);
                                                setHeroEditLang(lang.code as Language);
                                            }}
                                            className={`px-3 py-1 rounded text-sm whitespace-nowrap ${heroEditLang === lang.code ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
                                        >
                                            {lang.code.toUpperCase()}
                                        </button>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Título ({heroEditLang})</label>
                                    <input 
                                        className="w-full border rounded p-2" 
                                        value={editingService.title[heroEditLang]} 
                                        onChange={e => setEditingService({...editingService, title: {...editingService.title, [heroEditLang]: e.target.value}})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Descripción Corta ({heroEditLang})</label>
                                    <textarea 
                                        className="w-full border rounded p-2" rows={2}
                                        value={editingService.description[heroEditLang]} 
                                        onChange={e => setEditingService({...editingService, description: {...editingService.description, [heroEditLang]: e.target.value}})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Descripción Extendida (Modal) ({heroEditLang})</label>
                                    <textarea 
                                        className="w-full border rounded p-2" rows={5}
                                        value={editingService.extendedDescription?.[heroEditLang] || ''} 
                                        onChange={e => setEditingService({
                                            ...editingService, 
                                            extendedDescription: {...(editingService.extendedDescription || {}), [heroEditLang]: e.target.value} as any
                                        })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Características (Features) ({heroEditLang})</label>
                                    <p className="text-xs text-gray-500 mb-1">Cada línea se convertirá en un punto de la lista.</p>
                                    <textarea 
                                        className="w-full border rounded p-2 font-mono text-sm" rows={6}
                                        value={featuresText}
                                        onChange={e => setFeaturesText(e.target.value)}
                                        placeholder="- Característica 1&#10;- Característica 2"
                                    />
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                                <button onClick={() => setIsServiceModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancelar</button>
                                <button onClick={saveServiceHandler} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* ... Rest of components ... */}
        {/* === CONFIGURATOR ITEMS MANAGER (Omitted for brevity, logic handled in setup) === */}
        {activeTab === 'configurator' && (
             <div className="animate-fade-in">
                {/* Same Configurator Manager */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Items del Configurador</h2>
                    <button 
                        onClick={handleAddNewItem}
                        className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    >
                        <Plus size={18} /> Añadir Nuevo Item
                    </button>
                </div>
                {/* Table... */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título (ES)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visibilidad</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {configuratorItems.map((item, index) => (
                                <tr key={item.id} className={!item.visible ? 'bg-gray-50 opacity-60' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                             <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-20"><ArrowUp size={14}/></button>
                                             <button onClick={() => moveItem(index, 'down')} disabled={index === configuratorItems.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-20"><ArrowDown size={14}/></button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.icon}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{item.title['es']}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => toggleItemVisibility(item)} className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-primary-600">
                                            {item.visible ? <><Eye size={14} className="text-green-500"/> Visible</> : <><EyeOff size={14}/> Oculto</>}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEditItem(item)} className="text-primary-600 hover:text-primary-900 mr-4">Editar</button>
                                        <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Botó Guardar Canvis Items */}
                {hasItemsChanges && (
                    <div className="mt-6 flex justify-end">
                        <button 
                            onClick={saveItemsHandler}
                            disabled={isSavingItems}
                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {isSavingItems ? (
                                <><Clock size={18} className="animate-spin" /> Guardando...</>
                            ) : (
                                <><Save size={18} /> Guardar Cambios</>
                            )}
                        </button>
                    </div>
                )}
                
                 {/* Edit Configurator Item Modal (same as before) */}
                 {isEditingItemModalOpen && editingItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="font-bold text-lg">Editar Item</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Icono (Nombre Lucide)</label>
                                    <input className="w-full border rounded p-2" value={editingItem.icon} onChange={e => setEditingItem({...editingItem, icon: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Categoría</label>
                                    <select className="w-full border rounded p-2" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value as ServiceCategory})}>
                                        {Object.values(ServiceCategory).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="border-t pt-4 mt-4">
                                     <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                                        {SUPPORTED_LANGUAGES.map(lang => (
                                            <button 
                                                key={lang.code}
                                                onClick={() => setHeroEditLang(lang.code as Language)}
                                                className={`px-2 py-1 text-xs rounded whitespace-nowrap ${heroEditLang === lang.code ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
                                            >
                                                {lang.code.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                    <label className="block text-sm font-medium mb-1">Título ({heroEditLang})</label>
                                    <input 
                                        className="w-full border rounded p-2" 
                                        value={editingItem.title[heroEditLang]} 
                                        onChange={e => setEditingItem({...editingItem, title: {...editingItem.title, [heroEditLang]: e.target.value}})} 
                                    />
                                    <label className="block text-sm font-medium mb-1 mt-2">Beneficio ({heroEditLang})</label>
                                    <input 
                                        className="w-full border rounded p-2" 
                                        value={editingItem.benefit[heroEditLang]} 
                                        onChange={e => setEditingItem({...editingItem, benefit: {...editingItem.benefit, [heroEditLang]: e.target.value}})} 
                                    />
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                                <button onClick={() => setIsEditingItemModalOpen(false)} className="px-4 py-2 border rounded">Cancelar</button>
                                <button onClick={saveConfiguratorItemHandler} className="px-4 py-2 bg-primary-600 text-white rounded">Guardar</button>
                            </div>
                        </div>
                    </div>
                 )}
             </div>
        )}
        
        {/* ... Rest of Bot Config and Leads ... */}
         {/* === BOT CONFIG === */}
        {activeTab === 'bot' && botConfig && (
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 animate-fade-in max-w-6xl overflow-hidden">
             
             {/* Header */}
             <div className="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
                 <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                        <BrainCircuit className="text-purple-600" /> Configuración NEXI_tech
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Personaliza el comportamiento, identidad y conocimientos de tu asistente IA.</p>
                 </div>
                 <button 
                      onClick={saveBotConfigHandler}
                      className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                  >
                      <Save size={18} /> <span>Guardar Configuración</span>
                  </button>
             </div>
             {/* ... bot config form content (same as before) ... */}
             <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Identity & Tone */}
                <div className="space-y-6">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Users size={18} className="text-gray-500" /> Identidad y Tono
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del Asistente</label>
                                <input 
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                    value={botConfig.name}
                                    onChange={(e) => handleBotChange('name', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Personalidad (Tono)</label>
                                    <select 
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                                        value={botConfig.tone}
                                        onChange={(e) => handleBotChange('tone', e.target.value)}
                                    >
                                        <option value="professional">Profesional</option>
                                        <option value="friendly">Amigable</option>
                                        <option value="enthusiastic">Entusiasta</option>
                                        <option value="technical">Técnico</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Longitud Respuesta</label>
                                    <select 
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                                        value={botConfig.responseLength}
                                        onChange={(e) => handleBotChange('responseLength', e.target.value)}
                                    >
                                        <option value="concise">Concisa</option>
                                        <option value="balanced">Equilibrada</option>
                                        <option value="detailed">Detallada</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 {/* ... (rest of bot config inputs) ... */}
                 {/* Column 2: Strategy & Knowledge */}
                <div className="space-y-6">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Zap size={18} className="text-yellow-500" /> Estrategia y Conocimiento
                        </h3>
                        
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Producto Estrella (Resaltar)</label>
                            <input 
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                placeholder="Ej: Auditoría Gratis este mes"
                                value={botConfig.highlightedProduct}
                                onChange={(e) => handleBotChange('highlightedProduct', e.target.value)}
                            />
                            <p className="text-xs text-gray-400 mt-1">El bot intentará mencionar esto si es relevante.</p>
                        </div>

                        {/* Knowledge Base Section */}
                        <div className="border-t border-gray-200 pt-4">
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                <BookOpen size={14} /> Base de Conocimiento (Hechos)
                             </label>
                             <div className="flex gap-2 mb-3">
                                <input 
                                    className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                                    placeholder="Añadir hecho o dato clave..."
                                    value={newKnowledgeItem}
                                    onChange={(e) => setNewKnowledgeItem(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addKnowledgeItem()}
                                />
                                <button 
                                    onClick={addKnowledgeItem}
                                    className="bg-purple-600 text-white px-3 rounded-lg hover:bg-purple-700"
                                >
                                    <Plus size={18} />
                                </button>
                             </div>
                             <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                {(botConfig.knowledgeBase || []).length === 0 && <p className="text-xs text-gray-400 italic">No hay hechos definidos.</p>}
                                {(botConfig.knowledgeBase || []).map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start gap-2 bg-white p-2 rounded border border-gray-100 text-sm group">
                                        <span className="text-gray-700 leading-snug">{item}</span>
                                        <button onClick={() => removeKnowledgeItem(idx)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
                {/* Column 3: Custom & Preview */}
                <div className="space-y-6">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 h-full flex flex-col">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MessageSquare size={18} className="text-blue-500" /> Instrucciones Adicionales
                        </h3>
                         <textarea 
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 flex-1 p-3 text-sm"
                            rows={8}
                            placeholder="Añade cualquier instrucción específica aquí. Ej: Si el usuario menciona 'urgencia', facilítale este número..."
                            value={botConfig.customInstructions}
                            onChange={(e) => handleBotChange('customInstructions', e.target.value)}
                        />
                    </div>
                </div>
             </div>
           </div>
        )}

        {/* === NOTIFICATION SETTINGS === */}
        {activeTab === 'settings' && (
           <div className="max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-fade-in">
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
               <Bell className="text-primary-600" /> Configuración de Notificaciones
             </h2>
             
             <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                        <h4 className="font-medium text-gray-900">Alertas de Nuevo Lead (General)</h4>
                        <p className="text-sm text-gray-500">Recibir email cuando alguien rellena el formulario de contacto.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notificationSettings.notifyOnLead} onChange={() => {
                          const updated = { ...notificationSettings, notifyOnLead: !notificationSettings.notifyOnLead };
                          setNotificationSettings(updated);
                          updateNotificationSettings(updated);
                      }} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                        <h4 className="font-medium text-gray-900">Alertas de Configurador</h4>
                        <p className="text-sm text-gray-500">Recibir email cuando se solicita un presupuesto de paquete personalizado.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notificationSettings.notifyOnConfigurator} onChange={() => {
                          const updated = { ...notificationSettings, notifyOnConfigurator: !notificationSettings.notifyOnConfigurator };
                          setNotificationSettings(updated);
                          updateNotificationSettings(updated);
                      }} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                </div>

                <hr className="border-gray-100" />

                <div>
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users size={18} className="text-primary-500" /> Destinatarios de Email
                    </h4>
                    
                    <div className="flex gap-2 mb-4">
                        <input 
                            type="email" 
                            placeholder="nuevo@email.com" 
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                        />
                        <button 
                            onClick={addEmail}
                            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center gap-2"
                        >
                            <Plus size={18} /> Añadir
                        </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200">
                        {notificationSettings.emailRecipients.length === 0 && (
                            <div className="p-4 text-center text-gray-500 text-sm">No hay destinatarios configurados.</div>
                        )}
                        {notificationSettings.emailRecipients.map(email => (
                            <div key={email} className="p-3 flex justify-between items-center">
                                <span className="text-gray-700">{email}</span>
                                <button onClick={() => removeEmail(email)} className="text-red-400 hover:text-red-600 p-1">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
           </div>
        )}

        {/* === CENTRE DE LEADS UNIFICAT === */}
        {activeTab === 'leads' && (
          <div className="animate-fade-in">
            {/* Header amb estadístiques */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Users className="text-primary-600" /> Centre de Leads
                </h2>
                <p className="text-sm text-gray-500 mt-1">Tots els leads unificats en un sol lloc</p>
              </div>
              
              {/* Estadístiques ràpides */}
              <div className="flex gap-3">
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <span className="text-2xl font-bold text-blue-600">{unifiedLeads.length}</span>
                  <span className="text-xs text-blue-500 ml-2">Total</span>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <span className="text-2xl font-bold text-green-600">
                    {unifiedLeads.filter(l => l.gclid || l.utm_source === 'google').length}
                  </span>
                  <span className="text-xs text-green-500 ml-2">Google Ads</span>
                </div>
                <div className="bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
                  <span className="text-2xl font-bold text-purple-600">
                    {unifiedLeads.filter(l => l.lead_score && l.lead_score >= 70).length}
                  </span>
                  <span className="text-xs text-purple-500 ml-2">Qualificats</span>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Filtrar per:</span>
                </div>
                
                {/* Filtre per Font */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => setLeadSourceFilter('all')}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      leadSourceFilter === 'all' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tots ({unifiedLeads.length})
                  </button>
                  <button 
                    onClick={() => setLeadSourceFilter('contact-form')}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1 ${
                      leadSourceFilter === 'contact-form' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    <Mail size={14} /> Formulari ({unifiedLeads.filter(l => l.source === 'contact-form').length})
                  </button>
                  <button 
                    onClick={() => setLeadSourceFilter('configurator')}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1 ${
                      leadSourceFilter === 'configurator' 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    }`}
                  >
                    <ShoppingBag size={14} /> Configurador ({unifiedLeads.filter(l => l.source === 'configurator').length})
                  </button>
                  <button 
                    onClick={() => setLeadSourceFilter('catalog')}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1 ${
                      leadSourceFilter === 'catalog' 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                    }`}
                  >
                    <FileDown size={14} /> Catàleg ({unifiedLeads.filter(l => l.source === 'catalog').length})
                  </button>
                  <button 
                    onClick={() => setLeadSourceFilter('chatbot')}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1 ${
                      leadSourceFilter === 'chatbot' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                    }`}
                  >
                    <MessageSquareMore size={14} /> Chatbot ({unifiedLeads.filter(l => l.source === 'chatbot').length})
                  </button>
                </div>

                {/* Filtre per Campanya */}
                <div className="ml-auto">
                  <select
                    value={leadCampaignFilter}
                    onChange={(e) => setLeadCampaignFilter(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">Totes les campanyes</option>
                    <option value="google_ads">Google Ads</option>
                    <option value="organic">Orgànic</option>
                    {/* Generar opcions de campanyes úniques */}
                    {[...new Set(unifiedLeads.map(l => l.utm_campaign).filter(Boolean))].map(campaign => (
                      <option key={campaign} value={campaign}>{campaign}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Taula de Leads */}
            {(() => {
              // Aplicar filtres
              let filteredLeads = unifiedLeads;
              
              if (leadSourceFilter !== 'all') {
                filteredLeads = filteredLeads.filter(l => l.source === leadSourceFilter);
              }
              
              if (leadCampaignFilter !== 'all') {
                if (leadCampaignFilter === 'google_ads') {
                  filteredLeads = filteredLeads.filter(l => l.gclid || l.utm_source === 'google');
                } else if (leadCampaignFilter === 'organic') {
                  filteredLeads = filteredLeads.filter(l => !l.gclid && !l.utm_campaign);
                } else {
                  filteredLeads = filteredLeads.filter(l => l.utm_campaign === leadCampaignFilter);
                }
              }

              return filteredLeads.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No hi ha leads amb els filtres seleccionats.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Font</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telèfon</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campanya</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cita</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredLeads.map((lead) => (
                          <tr key={`${lead.sourceTable}-${lead.id}`} className="hover:bg-gray-50">
                            {/* Font amb badge de color */}
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                lead.source === 'contact-form' ? 'bg-blue-100 text-blue-700' :
                                lead.source === 'configurator' ? 'bg-orange-100 text-orange-700' :
                                lead.source === 'catalog' ? 'bg-amber-100 text-amber-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {lead.source === 'contact-form' && <Mail size={12} />}
                                {lead.source === 'configurator' && <ShoppingBag size={12} />}
                                {lead.source === 'catalog' && <FileDown size={12} />}
                                {lead.source === 'chatbot' && <MessageSquareMore size={12} />}
                                {lead.source === 'contact-form' ? 'Formulari' :
                                 lead.source === 'configurator' ? 'Configurador' :
                                 lead.source === 'catalog' ? 'Catàleg' : 'Chatbot'}
                              </span>
                            </td>
                            {/* Nom */}
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{lead.fullName || '-'}</div>
                            </td>
                            {/* Email */}
                            <td className="px-4 py-4 whitespace-nowrap">
                              <a href={`mailto:${lead.email}`} className="text-primary-600 hover:text-primary-800">
                                {lead.email || '-'}
                              </a>
                            </td>
                            {/* Telèfon */}
                            <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                              {lead.phone ? (
                                <a href={`tel:${lead.phone}`} className="hover:text-primary-600">{lead.phone}</a>
                              ) : '-'}
                            </td>
                            {/* Empresa */}
                            <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                              {lead.company || '-'}
                            </td>
                            {/* Campanya / UTM */}
                            <td className="px-4 py-4 whitespace-nowrap">
                              {lead.gclid ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                  <Target size={12} /> Google Ads
                                </span>
                              ) : lead.utm_campaign ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                                  <TrendingUp size={12} /> {lead.utm_campaign}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">Orgànic</span>
                              )}
                            </td>
                            {/* Lead Score */}
                            <td className="px-4 py-4 whitespace-nowrap">
                              {lead.lead_score !== null && lead.lead_score !== undefined ? (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                  lead.lead_score >= 70 ? 'bg-green-500' :
                                  lead.lead_score >= 40 ? 'bg-yellow-500' :
                                  'bg-red-400'
                                }`}>
                                  {lead.lead_score}
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gray-200 text-gray-500">
                                  -
                                </div>
                              )}
                            </td>
                            {/* Cita (Dia + Hora) */}
                            <td className="px-4 py-4 whitespace-nowrap">
                              {lead.proposed_date || lead.proposed_time ? (
                                <div className="flex flex-col text-xs">
                                  <span className="font-medium text-gray-900">{lead.proposed_date || '-'}</span>
                                  <span className="text-gray-500">{lead.proposed_time || '-'}</span>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </td>
                            {/* Data */}
                            <td className="px-4 py-4 whitespace-nowrap text-gray-500 text-sm">
                              {lead.created_at ? new Date(lead.created_at).toLocaleDateString('ca-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : '-'}
                            </td>
                            {/* Accions */}
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                {/* Veure detalls complets */}
                                <button
                                  onClick={() => {
                                    setSelectedLeadDetails(lead);
                                    setLeadDetailsModalOpen(true);
                                    setEditingAppointment(false);
                                  }}
                                  className="text-blue-500 hover:text-blue-700 p-1"
                                  title="Veure detalls complets"
                                >
                                  <Eye size={16} />
                                </button>
                                {/* Enriquir */}
                                <button
                                  onClick={async () => {
                                    const result = await enrichLead(lead.id, lead.sourceTable);
                                    if (result?.success) {
                                      alert('Lead enriquit correctament!');
                                      const allLeads = await getAllLeadsUnified();
                                      setUnifiedLeads(allLeads);
                                    }
                                  }}
                                  disabled={enrichLoading}
                                  className="text-purple-500 hover:text-purple-700 p-1 disabled:opacity-50"
                                  title="Enriquir lead"
                                >
                                  <Sparkles size={16} />
                                </button>
                                {/* Eliminar */}
                                <button
                                  onClick={async () => {
                                    if (confirm('Eliminar aquest lead?')) {
                                      const success = await deleteUnifiedLead(lead.id, lead.sourceTable);
                                      if (success) {
                                        setUnifiedLeads(unifiedLeads.filter(l => !(l.id === lead.id && l.sourceTable === lead.sourceTable)));
                                      }
                                    }
                                  }}
                                  className="text-red-400 hover:text-red-600 p-1"
                                  title="Eliminar lead"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* Botó exportar CSV */}
            {unifiedLeads.length > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    // Generar CSV
                    const headers = ['Font', 'Nom', 'Email', 'Telèfon', 'Empresa', 'Campanya', 'Score', 'Data'];
                    const rows = unifiedLeads.map(l => [
                      l.source,
                      l.fullName || '',
                      l.email || '',
                      l.phone || '',
                      l.company || '',
                      l.gclid ? 'Google Ads' : (l.utm_campaign || 'Orgànic'),
                      l.lead_score?.toString() || '',
                      l.created_at ? new Date(l.created_at).toISOString() : ''
                    ]);
                    
                    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <FileDown size={18} /> Exportar CSV
                </button>
              </div>
            )}
          </div>
        )}
        {/* === SOCIAL MEDIA & CATALOG CONFIG === */}
        {activeTab === 'social' && (
          <div className="max-w-3xl animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Link className="text-primary-600" /> Redes Sociales y Catálogo
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              {/* Catalog URL */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <label className="block text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  <FileDown size={18} /> URL del Catálogo PDF
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/catalogo.pdf o /catalogo.pdf"
                  className="w-full rounded-lg border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  value={socialMediaConfig.catalogUrl || ''}
                  onChange={(e) => setSocialMediaConfig({...socialMediaConfig, catalogUrl: e.target.value})}
                />
                <p className="text-xs text-amber-600 mt-2">
                  Este es el PDF que se descargará cuando un usuario introduzca su email en el footer.
                </p>
              </div>

              <hr className="border-gray-200" />

              {/* Social Media Links */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Enlaces Redes Sociales</h3>
                <p className="text-sm text-gray-500 mb-4">Deja en blanco los que no tengas. Solo se mostrarán en el footer los que tengan URL.</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <Linkedin size={20} />
                    </div>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/company/..."
                      className="flex-1 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      value={socialMediaConfig.linkedin || ''}
                      onChange={(e) => setSocialMediaConfig({...socialMediaConfig, linkedin: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white">
                      <Twitter size={20} />
                    </div>
                    <input
                      type="url"
                      placeholder="https://twitter.com/..."
                      className="flex-1 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      value={socialMediaConfig.twitter || ''}
                      onChange={(e) => setSocialMediaConfig({...socialMediaConfig, twitter: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                      <Facebook size={20} />
                    </div>
                    <input
                      type="url"
                      placeholder="https://facebook.com/..."
                      className="flex-1 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      value={socialMediaConfig.facebook || ''}
                      onChange={(e) => setSocialMediaConfig({...socialMediaConfig, facebook: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center text-white">
                      <Instagram size={20} />
                    </div>
                    <input
                      type="url"
                      placeholder="https://instagram.com/..."
                      className="flex-1 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      value={socialMediaConfig.instagram || ''}
                      onChange={(e) => setSocialMediaConfig({...socialMediaConfig, instagram: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">
                      <Youtube size={20} />
                    </div>
                    <input
                      type="url"
                      placeholder="https://youtube.com/..."
                      className="flex-1 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      value={socialMediaConfig.youtube || ''}
                      onChange={(e) => setSocialMediaConfig({...socialMediaConfig, youtube: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={async () => {
                    const success = await updateSocialMediaConfig(socialMediaConfig);
                    if (success) {
                      alert('Configuración guardada correctamente');
                    } else {
                      alert('Error al guardar la configuración');
                    }
                  }}
                  className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === FOOTER CONTENT === */}
        {activeTab === 'footer' && (
          <div className="animate-fade-in space-y-6 max-w-4xl">
            <div className="flex justify-between items-center sticky top-0 bg-gray-50 z-20 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <AlignLeft className="text-primary-600" /> Textos del Footer
              </h2>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
                  <Languages size={18} className="text-gray-500" />
                  <select 
                    value={heroEditLang}
                    onChange={(e) => setHeroEditLang(e.target.value as Language)}
                    className="text-sm border-none focus:ring-0 bg-transparent"
                  >
                    {SUPPORTED_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                  </select>
                </div>
                <button 
                  onClick={saveBrandConfigHandler}
                  disabled={isSavingBrand}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSavingBrand ? <Settings className="animate-spin" size={18} /> : <Save size={18} />}
                  <span>{isSavingBrand ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </div>

            {/* About Text */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-primary-500" />
                Texto "Sobre Nosotros"
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Este texto aparece en la primera columna del footer, debajo del logo.
              </p>
              <textarea
                rows={4}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                placeholder="Descripción de la empresa..."
                value={brandConfig.footer?.aboutText?.[heroEditLang] || ''}
                onChange={(e) => setBrandConfig({
                  ...brandConfig,
                  footer: {
                    ...brandConfig.footer,
                    aboutText: {
                      ...brandConfig.footer?.aboutText,
                      [heroEditLang]: e.target.value
                    }
                  }
                })}
              />
            </div>

            {/* Contact Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-primary-500" />
                Dirección de Contacto
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Dirección física que aparece en la sección de contacto del footer.
              </p>
              <input
                type="text"
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                placeholder="Polígono Industrial, Ciudad, País"
                value={brandConfig.footer?.contactAddress?.[heroEditLang] || ''}
                onChange={(e) => setBrandConfig({
                  ...brandConfig,
                  footer: {
                    ...brandConfig.footer,
                    contactAddress: {
                      ...brandConfig.footer?.contactAddress,
                      [heroEditLang]: e.target.value
                    }
                  }
                })}
              />
            </div>

            {/* Legal Texts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Lock size={18} className="text-primary-500" />
                Textos Legales (Barra Inferior)
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Textos de los enlaces legales que aparecen en la barra inferior del footer.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Copyright</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="© 2024 MiEmpresa"
                    value={brandConfig.footer?.copyrightText?.[heroEditLang] || ''}
                    onChange={(e) => setBrandConfig({
                      ...brandConfig,
                      footer: {
                        ...brandConfig.footer,
                        copyrightText: {
                          ...brandConfig.footer?.copyrightText,
                          [heroEditLang]: e.target.value
                        }
                      }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enlace Privacidad</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Política de Privacidad"
                    value={brandConfig.footer?.privacyText?.[heroEditLang] || ''}
                    onChange={(e) => setBrandConfig({
                      ...brandConfig,
                      footer: {
                        ...brandConfig.footer,
                        privacyText: {
                          ...brandConfig.footer?.privacyText,
                          [heroEditLang]: e.target.value
                        }
                      }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enlace Aviso Legal</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Aviso Legal"
                    value={brandConfig.footer?.legalText?.[heroEditLang] || ''}
                    onChange={(e) => setBrandConfig({
                      ...brandConfig,
                      footer: {
                        ...brandConfig.footer,
                        legalText: {
                          ...brandConfig.footer?.legalText,
                          [heroEditLang]: e.target.value
                        }
                      }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enlace Cookies</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Política de Cookies"
                    value={brandConfig.footer?.cookiesText?.[heroEditLang] || ''}
                    onChange={(e) => setBrandConfig({
                      ...brandConfig,
                      footer: {
                        ...brandConfig.footer,
                        cookiesText: {
                          ...brandConfig.footer?.cookiesText,
                          [heroEditLang]: e.target.value
                        }
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Los textos del footer se guardan junto con la configuración de marca. 
                Recuerda completar todos los idiomas para una experiencia multilingüe completa.
                El logo, email y teléfono se configuran en "Kit de Marca & Hero". Las redes sociales y URL del catálogo en "Redes Sociales".
              </p>
            </div>
          </div>
        )}

        {/* === TEXTOS LEGALS === */}
        {activeTab === 'legal' && (
          <div className="max-w-5xl animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Scale className="text-primary-600" /> Textos Legals
            </h2>
            <p className="text-gray-500 mb-6">
              Edita els textos de les pàgines legals: Política de Privacitat, Política de Cookies i Avís Legal.
            </p>

            {/* Selector d'idioma */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Languages size={18} /> Idioma d'edició:
                </span>
                <div className="flex gap-2">
                  {SUPPORTED_LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLegalEditLang(l.code as Language)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        legalEditLang === l.code
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {l.flag} {l.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Llista de textos legals */}
            <div className="space-y-6">
              {legalTexts.map(legal => (
                <div key={legal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {legal.id === 'privacy' && '🔒 Política de Privacitat'}
                        {legal.id === 'cookies' && '🍪 Política de Cookies'}
                        {legal.id === 'legal' && '⚖️ Avís Legal'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Última actualització: {legal.last_updated ? new Date(legal.last_updated).toLocaleDateString('ca-ES') : 'Mai'}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingLegalId(editingLegalId === legal.id ? null : legal.id)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                        editingLegalId === legal.id
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {editingLegalId === legal.id ? 'Tancar' : 'Editar'}
                    </button>
                  </div>

                  {editingLegalId === legal.id && (
                    <div className="p-6 space-y-4">
                      {/* Títol */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Títol ({legalEditLang.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                          value={legal.title?.[legalEditLang] || ''}
                          onChange={(e) => {
                            setLegalTexts(legalTexts.map(l => 
                              l.id === legal.id 
                                ? { ...l, title: { ...l.title, [legalEditLang]: e.target.value } }
                                : l
                            ));
                          }}
                        />
                      </div>

                      {/* Contingut */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contingut ({legalEditLang.toUpperCase()}) - Suporta HTML
                        </label>
                        <textarea
                          rows={15}
                          className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 font-mono text-sm"
                          value={legal.content?.[legalEditLang] || ''}
                          onChange={(e) => {
                            setLegalTexts(legalTexts.map(l => 
                              l.id === legal.id 
                                ? { ...l, content: { ...l.content, [legalEditLang]: e.target.value } }
                                : l
                            ));
                          }}
                          placeholder="<h2>Secció 1</h2><p>Text de la secció...</p>"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Pots usar HTML: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a href=&quot;...&quot;&gt;
                        </p>
                      </div>

                      {/* Botó Guardar */}
                      <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button
                          onClick={async () => {
                            setIsSavingLegal(true);
                            const success = await updateLegalText(legal.id, {
                              title: legal.title,
                              content: legal.content
                            });
                            setIsSavingLegal(false);
                            if (success) {
                              alert('Text legal guardat correctament!');
                            } else {
                              alert('Error guardant el text legal');
                            }
                          }}
                          disabled={isSavingLegal}
                          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          {isSavingLegal ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              Guardant...
                            </>
                          ) : (
                            <>
                              <Save size={18} /> Guardar
                            </>
                          )}
                        </button>
                      </div>

                      {/* Preview */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Eye size={16} /> Vista prèvia
                        </h4>
                        <div 
                          className="p-4 bg-gray-50 rounded-lg prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: legal.content?.[legalEditLang] || '<p class="text-gray-400 italic">Sense contingut</p>' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {legalTexts.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500 mb-3" />
                  <p className="text-yellow-800">No s'han trobat textos legals a la base de dades.</p>
                  <p className="text-sm text-yellow-600 mt-1">Verifica que la taula 'legal_texts' s'ha creat correctament.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Enrichment Details */}
        {enrichmentModalOpen && selectedEnrichment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-600">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Building2 size={20} />
                  {selectedEnrichment.company_name || 'Detalls de l\'empresa'}
                </h3>
                <button onClick={() => setEnrichmentModalOpen(false)} className="text-white hover:text-gray-200">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Info bàsica */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Sector</p>
                    <p className="font-medium text-gray-900">{selectedEnrichment.sector || '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Mida</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedEnrichment.estimated_size === 'gran' ? 'bg-purple-100 text-purple-700' :
                      selectedEnrichment.estimated_size === 'mitjana' ? 'bg-green-100 text-green-700' :
                      selectedEnrichment.estimated_size === 'petita' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedEnrichment.estimated_size || 'Desconeguda'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Empleats</p>
                    <p className="font-medium text-gray-900">{selectedEnrichment.estimated_employees || '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Ubicació</p>
                    <p className="font-medium text-gray-900">{selectedEnrichment.location || '-'}</p>
                  </div>
                </div>

                {/* Web */}
                {selectedEnrichment.website && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Web</p>
                    <a
                      href={selectedEnrichment.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <Globe size={16} /> {selectedEnrichment.website}
                    </a>
                  </div>
                )}

                {/* Descripció */}
                {selectedEnrichment.description && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Descripció</p>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedEnrichment.description}</p>
                  </div>
                )}

                {/* Serveis/Productes */}
                {selectedEnrichment.services_products?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Serveis/Productes</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEnrichment.services_products.map((s: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Necessitats IT */}
                {selectedEnrichment.potential_needs?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Necessitats IT Potencials</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEnrichment.potential_needs.map((n: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{n}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confiança */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Confiança de les dades:</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(selectedEnrichment.confidence_score || 0) * 100}%` }}
                        />
                      </div>
                      <span className="font-bold text-gray-700">
                        {Math.round((selectedEnrichment.confidence_score || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedEnrichment.notes && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-800">📝 Notes:</p>
                    <p className="text-yellow-700">{selectedEnrichment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Detalls Lead Complet */}
        {leadDetailsModalOpen && selectedLeadDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className={`p-6 border-b border-gray-200 flex justify-between items-center ${
                selectedLeadDetails.source === 'chatbot' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                selectedLeadDetails.source === 'configurator' ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
                selectedLeadDetails.source === 'catalog' ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                'bg-gradient-to-r from-blue-600 to-cyan-600'
              }`}>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  {selectedLeadDetails.source === 'chatbot' && <MessageSquareMore size={20} />}
                  {selectedLeadDetails.source === 'configurator' && <ShoppingBag size={20} />}
                  {selectedLeadDetails.source === 'catalog' && <FileDown size={20} />}
                  {selectedLeadDetails.source === 'contact-form' && <Mail size={20} />}
                  Detalls del Lead - {selectedLeadDetails.fullName || selectedLeadDetails.email || 'Sense nom'}
                </h3>
                <button onClick={() => setLeadDetailsModalOpen(false)} className="text-white hover:text-gray-200">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Info bàsica */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">👤 Nom</p>
                    <p className="font-medium text-gray-900">{selectedLeadDetails.fullName || '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">📧 Email</p>
                    <p className="font-medium text-gray-900">
                      {selectedLeadDetails.email ? (
                        <a href={`mailto:${selectedLeadDetails.email}`} className="text-blue-600 hover:underline">
                          {selectedLeadDetails.email}
                        </a>
                      ) : '-'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">📱 Telèfon</p>
                    <p className="font-medium text-gray-900">
                      {selectedLeadDetails.phone ? (
                        <a href={`tel:${selectedLeadDetails.phone}`} className="text-blue-600 hover:underline">
                          {selectedLeadDetails.phone}
                        </a>
                      ) : '-'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">🏢 Empresa</p>
                    <p className="font-medium text-gray-900">{selectedLeadDetails.company || '-'}</p>
                  </div>
                </div>

                {/* CITA ACORDADA (només per chatbot) - EDITABLE */}
                {selectedLeadDetails.source === 'chatbot' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-green-800 flex items-center gap-2">
                        <Calendar size={18} /> Cita Acordada
                      </h4>
                      {!editingAppointment ? (
                        <button
                          onClick={() => {
                            setEditingAppointment(true);
                            setEditProposedDate(selectedLeadDetails.proposed_date || '');
                            setEditProposedTime(selectedLeadDetails.proposed_time || '');
                          }}
                          className="text-green-700 hover:text-green-900 text-sm flex items-center gap-1"
                        >
                          <Edit2 size={14} /> Editar
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              setSavingAppointment(true);
                              const success = await updateChatbotLeadAppointment(
                                selectedLeadDetails.id,
                                editProposedDate || null,
                                editProposedTime || null
                              );
                              if (success) {
                                // Actualitzar l'estat local
                                setSelectedLeadDetails({
                                  ...selectedLeadDetails,
                                  proposed_date: editProposedDate || null,
                                  proposed_time: editProposedTime || null
                                });
                                // Actualitzar la llista de leads
                                const allLeads = await getAllLeadsUnified();
                                setUnifiedLeads(allLeads);
                              }
                              setSavingAppointment(false);
                              setEditingAppointment(false);
                            }}
                            disabled={savingAppointment}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            {savingAppointment ? <Clock size={14} className="animate-spin" /> : <Check size={14} />}
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingAppointment(false)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                          >
                            Cancel·lar
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-green-700 uppercase font-bold mb-1">📅 Data Proposada</p>
                        {editingAppointment ? (
                          <input
                            type="date"
                            value={editProposedDate}
                            onChange={(e) => setEditProposedDate(e.target.value)}
                            className="w-full rounded-lg border-green-300 focus:border-green-500 focus:ring-green-500"
                          />
                        ) : (
                          <p className="font-medium text-green-900 text-lg">
                            {selectedLeadDetails.proposed_date || 'No especificada'}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-green-700 uppercase font-bold mb-1">🕐 Hora Proposada</p>
                        {editingAppointment ? (
                          <input
                            type="time"
                            value={editProposedTime}
                            onChange={(e) => setEditProposedTime(e.target.value)}
                            className="w-full rounded-lg border-green-300 focus:border-green-500 focus:ring-green-500"
                          />
                        ) : (
                          <p className="font-medium text-green-900 text-lg">
                            {selectedLeadDetails.proposed_time || 'No especificada'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tracking / Campanya */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-bold text-indigo-800 mb-3 flex items-center gap-2">
                    <TrendingUp size={18} /> Origen / Campanya
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-indigo-700 uppercase font-bold mb-1">Font</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                        selectedLeadDetails.source === 'contact-form' ? 'bg-blue-100 text-blue-700' :
                        selectedLeadDetails.source === 'configurator' ? 'bg-orange-100 text-orange-700' :
                        selectedLeadDetails.source === 'catalog' ? 'bg-amber-100 text-amber-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {selectedLeadDetails.source === 'contact-form' ? 'Formulari' :
                         selectedLeadDetails.source === 'configurator' ? 'Configurador' :
                         selectedLeadDetails.source === 'catalog' ? 'Catàleg' : 'Chatbot'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-700 uppercase font-bold mb-1">Campanya</p>
                      <p className="font-medium text-indigo-900">{selectedLeadDetails.utm_campaign || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-700 uppercase font-bold mb-1">GCLID</p>
                      <p className="font-medium text-indigo-900">
                        {selectedLeadDetails.gclid ? (
                          <span className="text-green-600">✓ Google Ads</span>
                        ) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-700 uppercase font-bold mb-1">Medium</p>
                      <p className="font-medium text-indigo-900">{selectedLeadDetails.utm_medium || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Qualificació / Score */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                    <Star size={18} /> Qualificació
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-amber-700 uppercase font-bold mb-1">Lead Score</p>
                      {selectedLeadDetails.lead_score !== null && selectedLeadDetails.lead_score !== undefined ? (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white ${
                          selectedLeadDetails.lead_score >= 70 ? 'bg-green-500' :
                          selectedLeadDetails.lead_score >= 40 ? 'bg-yellow-500' :
                          'bg-red-400'
                        }`}>
                          {selectedLeadDetails.lead_score}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-amber-700 uppercase font-bold mb-1">Interès</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedLeadDetails.interest_level === 'calent' ? 'bg-red-100 text-red-700' :
                        selectedLeadDetails.interest_level === 'tebi' ? 'bg-yellow-100 text-yellow-700' :
                        selectedLeadDetails.interest_level === 'fred' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {selectedLeadDetails.interest_level || '-'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-amber-700 uppercase font-bold mb-1">Mida Empresa</p>
                      <p className="font-medium text-amber-900">{selectedLeadDetails.company_size || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-amber-700 uppercase font-bold mb-1">Nivell Tècnic</p>
                      <p className="font-medium text-amber-900">{selectedLeadDetails.tech_level || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Missatge / Resum conversa */}
                {(selectedLeadDetails.message || selectedLeadDetails.conversation_summary) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <MessageSquare size={18} /> 
                      {selectedLeadDetails.source === 'chatbot' ? 'Resum Conversa' : 'Missatge'}
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedLeadDetails.conversation_summary || selectedLeadDetails.message || '-'}
                    </p>
                  </div>
                )}

                {/* Serveis seleccionats (configurador) */}
                {selectedLeadDetails.selectedItems && selectedLeadDetails.selectedItems.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                      <ShoppingBag size={18} /> Serveis Seleccionats
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLeadDetails.selectedItems.map((item: any, i: number) => (
                        <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                          {typeof item === 'string' ? item : item.title || item.name || JSON.stringify(item)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Data creació */}
                <div className="pt-4 border-t flex justify-between items-center text-sm text-gray-500">
                  <span>Creat: {selectedLeadDetails.created_at ? new Date(selectedLeadDetails.created_at).toLocaleString('ca-ES') : '-'}</span>
                  <span>Font: {selectedLeadDetails.sourceTable}</span>
                </div>

                {/* Botó veure enrichment */}
                {selectedLeadDetails.company_enrichment && (
                  <button
                    onClick={() => {
                      setSelectedEnrichment(selectedLeadDetails.company_enrichment);
                      setLeadDetailsModalOpen(false);
                      setEnrichmentModalOpen(true);
                    }}
                    className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                  >
                    <Building2 size={18} /> Veure Detalls Empresa Enriquits
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

</main>
    </div>
  );
};

export default AdminDashboard;