
import React, { useState, useEffect } from 'react';
import { 
  loginMock, logoutMock, checkAuth, getBrandConfig, updateBrandConfig, 
  getConfiguratorLeads, getNotificationSettings, updateNotificationSettings,
  getServices, updateServices, getConfiguratorItems, saveConfiguratorItem, deleteConfiguratorItem, updateConfiguratorItemsOrder,
  getCustomSections, getBotConfig, updateBotConfig, getLeads, deleteLead, deleteConfiguratorLead
} from '../services/supabaseMock';
import { 
  FileText, Settings, LogOut, Users, Database, Image as ImageIcon, Upload, Save, 
  LayoutDashboard, ShoppingBag, Bell, Plus, Trash2, Edit2, CheckCircle, Languages, Monitor,
  AlignLeft, Move, MapPin, Phone, X, AlertTriangle, Clock, Zap, MessageSquare, BrainCircuit, Mic,
  Eye, EyeOff, ArrowUp, ArrowDown, BookOpen, Mail, Star, Globe, Lock
} from 'lucide-react';
import { LeadForm, BrandConfig, ConfiguratorLead, NotificationSettings, Service, ConfiguratorItem, Language, DynamicSection, ServiceCategory, BotConfig } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants';


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

  // Sections State
  const [customSections, setCustomSections] = useState<DynamicSection[]>([]);

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

  const handleHeroTextChange = (field: 'title' | 'subtitle' | 'ctaText', value: string) => {
      setBrandConfig(prev => ({
          ...prev,
          hero: {
              ...prev.hero,
              [field]: {
                  ...prev.hero[field],
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

  const toggleServiceVisibility = async (service: Service) => {
      const updatedService = { ...service, visible: !service.visible };
      const updatedList = services.map(s => s.id === service.id ? updatedService : s);
      setServices(updatedList);
      await updateServices(updatedList);
  };

  const moveService = async (index: number, direction: 'up' | 'down') => {
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === services.length - 1)) return;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const newServices = [...services];
      [newServices[index], newServices[newIndex]] = [newServices[newIndex], newServices[index]];
      
      // Update order property
      newServices.forEach((s, idx) => s.order = idx);
      
      setServices(newServices);
      await updateServices(newServices);
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
          order: configuratorItems.length
      });
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

  const toggleItemVisibility = async (item: ConfiguratorItem) => {
      const updatedItem = { ...item, visible: !item.visible };
      await saveConfiguratorItem(updatedItem);
      setConfiguratorItems(prev => prev.map(i => i.id === item.id ? updatedItem : i));
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === configuratorItems.length - 1)) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...configuratorItems];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    
    // Update order property locally and in DB
    newItems.forEach((item, idx) => item.order = idx);

    setConfiguratorItems(newItems);
    await updateConfiguratorItemsOrder(newItems);
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
            <Users size={20} /> <span>Leads Center</span>
          </button>
          <button onClick={() => setActiveTab('custom_leads')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'custom_leads' ? 'bg-primary-700' : 'hover:bg-primary-800'}`}>
            <ShoppingBag size={20} /> <span>Paquetes Personalizados</span>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de Fondo</label>
                            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 group">
                                <img 
                                    src={brandConfig.hero.image} 
                                    alt="Hero Preview" 
                                    className="w-full h-full object-cover" 
                                    style={{ objectPosition: brandConfig.hero.imagePosition }}
                                />
                                {/* Overlay Preview */}
                                <div 
                                    className="absolute inset-0 pointer-events-none transition-colors duration-300"
                                    style={{ backgroundColor: `rgba(15, 23, 42, ${brandConfig.hero.overlayOpacity})` }}
                                ></div>

                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2">
                                        <Upload size={18} /> Cambiar Imagen
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'hero')} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Move size={16} /> Alineación de la Imagen
                            </label>
                            <select 
                                value={brandConfig.hero.imagePosition}
                                onChange={(e) => setBrandConfig(prev => ({ ...prev, hero: { ...prev.hero, imagePosition: e.target.value } }))}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                                <option value="center">Centro (Por defecto)</option>
                                <option value="top">Arriba (Top)</option>
                                <option value="bottom">Abajo (Bottom)</option>
                                <option value="left">Izquierda (Left)</option>
                                <option value="right">Derecha (Right)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Opacidad del Filtro (Overlay): {Math.round(brandConfig.hero.overlayOpacity * 100)}%
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

        {/* ... (Leads Center and Custom Packs Leads remain same) ... */}
                {/* === LEADS CENTER === */}
        {activeTab === 'leads' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Users className="text-primary-600" /> Leads Generales
              <span className="text-sm font-normal text-gray-500">({mockLeads.length} total)</span>
            </h2>
            
            {mockLeads.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                <Mail size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No hay leads todavía.</p>
                <p className="text-sm mt-2">Los leads aparecerán aquí cuando alguien complete el formulario de contacto.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockLeads.map((lead: any) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{lead.fullName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a href={`mailto:${lead.email}`} className="text-primary-600 hover:text-primary-800">
                              {lead.email}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {lead.phone || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {lead.company || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                              {lead.serviceInterest || 'General'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                            {lead.created_at ? new Date(lead.created_at).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={async () => {
                                if (confirm('¿Eliminar este lead?')) {
                                  const success = await deleteLead(lead.id);
                                  if (success) {
                                    setMockLeads(mockLeads.filter((l: any) => l.id !== lead.id));
                                  }
                                }
                              }}
                              className="text-red-400 hover:text-red-600 p-1"
                              title="Eliminar lead"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Detall del missatge si existeix */}
                {mockLeads.some((l: any) => l.message) && (
                  <div className="border-t border-gray-200 p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Últimos mensajes:</h4>
                    <div className="space-y-3">
                      {mockLeads.filter((l: any) => l.message).slice(0, 3).map((lead: any) => (
                        <div key={lead.id + '-msg'} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-gray-800">{lead.fullName}</span>
                            <span className="text-xs text-gray-400">
                              {lead.created_at ? new Date(lead.created_at).toLocaleDateString('es-ES') : ''}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{lead.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* === PAQUETES PERSONALIZADOS (Configurator Leads) === */}
        {activeTab === 'custom_leads' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <ShoppingBag className="text-primary-600" /> Paquetes Personalizados
              <span className="text-sm font-normal text-gray-500">({configuratorLeads.length} total)</span>
            </h2>
            
            {configuratorLeads.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No hay solicitudes de paquetes personalizados.</p>
                <p className="text-sm mt-2">Las solicitudes aparecerán aquí cuando alguien configure un paquete personalizado.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Seleccionados</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {configuratorLeads.map((lead: ConfiguratorLead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a href={`mailto:${lead.email}`} className="text-primary-600 hover:text-primary-800 font-medium">
                              {lead.email}
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {(lead.selectedItems || []).length > 0 ? (
                                (lead.selectedItems || []).map((item: any, idx: number) => (
                                  <span key={idx} className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                                    {typeof item === 'string' ? item : item.title?.es || item.title || 'Item'}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 text-sm">Sin items</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                            {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={async () => {
                                if (confirm('¿Eliminar esta solicitud?')) {
                                  const success = await deleteConfiguratorLead(lead.id);
                                  if (success) {
                                    setConfiguratorLeads(configuratorLeads.filter((l: ConfiguratorLead) => l.id !== lead.id));
                                  }
                                }
                              }}
                              className="text-red-400 hover:text-red-600 p-1"
                              title="Eliminar solicitud"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

</main>
    </div>
  );
};

export default AdminDashboard;