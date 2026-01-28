

import { Service, ServiceCategory, Translation, ConfiguratorItem, WizardStep } from './types';
import { 
  Wifi, Network, ShieldCheck, Server, Cloud, PhoneCall, Cpu, Briefcase, 
  Zap, Lock, Activity, Globe, Store, Building, Factory, AlertTriangle, WifiOff, FileText, HardDrive, TrendingUp, Shield, Camera, Smartphone, Globe2
} from 'lucide-react';

export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'ca', name: 'Català' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
];

export const TRANSLATIONS: Translation = {
  // Navigation
  navHome: { es: "Inicio", ca: "Inici", en: "Home", fr: "Accueil", de: "Startseite", it: "Home" },
  navServices: { es: "Servicios", ca: "Serveis", en: "Services", fr: "Services", de: "Dienstleistungen", it: "Servizi" },
  navAbout: { es: "Nosotros", ca: "Nosaltres", en: "About", fr: "À propos", de: "Über uns", it: "Chi siamo" },
  navContact: { es: "Contacto", ca: "Contacte", en: "Contact", fr: "Contact", de: "Kontakt", it: "Contatto" },

  // Hero
  heroTitle: {
    es: "Soluciones Inteligentes para un Entorno Empresarial Competitivo",
    ca: "Solucions Intel·ligents per a un Entorn Empresarial Competitiu",
    en: "Intelligent Solutions for a Competitive Business Environment",
    fr: "Des solutions intelligentes pour un environnement commercial compétitif",
    de: "Intelligente Lösungen für ein wettbewerbsfähiges Geschäftsumfeld",
    it: "Soluzioni intelligenti per un ambiente aziendale competitivo"
  },
  heroSubtitle: {
    es: "Desarrollo e Integración de Soluciones Avanzadas en Energía, Sistemas y Telecomunicaciones",
    ca: "Desenvolupament i Integració de Solucions Avançades en Energia, Sistemas i Telecomunicacions",
    en: "Development and Integration of Advanced Solutions in Energy, Systems, and Telecommunications",
    fr: "Développement et intégration de solutions avancées en énergie, systèmes et télécommunications",
    de: "Entwicklung und Integration fortschrittlicher Lösungen in den Bereichen Energie, Systeme und Telekommunikation",
    it: "Sviluppo e integrazione di soluzioni avanzate in energia, sistemi e telecomunicazioni"
  },
  ctaButton: {
    es: "Solicita una Consultoría Gratuita",
    ca: "Sol·licita una Consultoria Gratuïta",
    en: "Request a Free Consultation",
    fr: "Demander une consultation gratuite",
    de: "Kostenlose Beratung anfordern",
    it: "Richiedi una consulenza gratuita"
  },
  
  // Benefits Section (New)
  benefitsTitle: {
    es: "¿Por qué elegir EportsTech?",
    ca: "Per què triar EportsTech?",
    en: "Why Choose EportsTech?",
    fr: "Pourquoi choisir EportsTech?",
    de: "Warum EportsTech wählen?",
    it: "Perché scegliere EportsTech?"
  },
  benefitsSubtitle: {
    es: "Unificamos tecnología, estrategia y soporte para impulsar tu crecimiento.",
    ca: "Unifiquem tecnologia, estratègia i suport per impulsar el teu creixement.",
    en: "We unify technology, strategy, and support to drive your growth.",
    fr: "Nous unifions technologie, stratégie et support.",
    de: "Wir vereinen Technologie, Strategie und Support.",
    it: "Unifichiamo tecnologia, strategia e supporto."
  },
  ben1Title: { es: "Visión Integral 360º", ca: "Visió Integral 360º", en: "360º Integral Vision", fr: "Vision Intégrale", de: "Integrale Vision", it: "Visione Integrale" },
  ben1Desc: { 
    es: "Centralizamos todas sus necesidades tecnológicas (Energía, Telecomunicaciones, IT) en un único socio estratégico.",
    ca: "Centralitzem totes les teves necessitats tecnològiques en un únic soci estratègic.",
    en: "We centralize all your tech needs (Energy, Telco, IT) in a single strategic partner.",
    fr: "Nous centralisons tous vos besoins technologiques (Énergie, Télécoms, IT) en un seul partenaire stratégique.",
    de: "Wir zentralisieren alle Ihre technologischen Bedürfnisse (Energie, Telekommunikation, IT) bei einem einzigen strategischen Partner.",
    it: "Centralizziamo tutte le tue esigenze tecnologiche (Energia, Telecomunicazioni, IT) in un unico partner strategico."
  },
  ben2Title: { es: "Soporte Proactivo", ca: "Suport Proactiu", en: "Proactive Support", fr: "Support Proactif", de: "Proaktiver Support", it: "Supporto Proattivo" },
  ben2Desc: { 
    es: "Monitorización constante para prevenir incidencias antes de que ocurran. Tu continuidad de negocio es nuestra prioridad.",
    ca: "Monitoratge constant per prevenir incidències. La teva continuïtat és la nostra prioritat.",
    en: "Constant monitoring to prevent issues. Your business continuity is our priority.",
    fr: "Surveillance constante pour prévenir les problèmes. Votre continuité d'activité est notre priorité.",
    de: "Ständige Überwachung zur Vermeidung von Problemen. Ihre Geschäftskontinuität ist unsere Priorität.",
    it: "Monitoraggio costante per prevenire i problemi. La continuità del tuo business è la nostra priorità."
  },
  ben3Title: { es: "Innovación Real", ca: "Innovació Real", en: "Real Innovation", fr: "Innovation Réelle", de: "Echte Innovation", it: "Vera Innovazione" },
  ben3Desc: { 
    es: "Implementamos las últimas tecnologías (IoT, AI, Cloud) adaptadas a la realidad y presupuesto de tu empresa.",
    ca: "Implementem les últimes tecnologies adaptades a la realitat i pressupost de la teva empresa.",
    en: "We implement the latest technologies (IoT, AI, Cloud) adapted to your reality.",
    fr: "Nous mettons en œuvre les dernières technologies (IoT, IA, Cloud) adaptées à votre réalité.",
    de: "Wir implementieren die neuesten Technologien (IoT, KI, Cloud), angepasst an Ihre Realität.",
    it: "Implementiamo le ultime tecnologie (IoT, AI, Cloud) adattate alla tua realtà."
  },
  ben4Title: { es: "Escalabilidad", ca: "Escalabilitat", en: "Scalability", fr: "Évolutivité", de: "Skalierbarkeit", it: "Scalabilità" },
  ben4Desc: { 
    es: "Soluciones que crecen contigo. Desde startups hasta grandes corporaciones, nos adaptamos a tu ritmo.",
    ca: "Solucions que creixen amb tu. Des de startups fins a grans corporacions.",
    en: "Solutions that grow with you. From startups to large corporations.",
    fr: "Des solutions qui grandissent avec vous. Des startups aux grandes entreprises.",
    de: "Lösungen, die mit Ihnen wachsen. Von Startups bis hin zu großen Unternehmen.",
    it: "Soluzioni che crescono con te. Dalle startup alle grandi aziende."
  },

  servicesTitle: {
    es: "Nuestras Soluciones",
    ca: "Les Nostres Solucions",
    en: "Our Solutions",
    fr: "Nos Solutions",
    de: "Unsere Lösungen",
    it: "Le Nostre Soluzioni"
  },
  configuratorTitle: {
    es: "Configurador de Paquetes a Medida",
    ca: "Configurador de Paquets a Mida",
    en: "Custom Package Configurator",
    fr: "Configurateur de Paquets Personnalisés",
    de: "Benutzerdefinierter Paketkonfigurator",
    it: "Configuratore di Pacchetti Personalizzati"
  },
  configuratorSubtitle: {
    es: "Selecciona los servicios que necesitas y solicita un presupuesto personalizado.",
    ca: "Selecciona els serveis que necessites i sol·licita un pressupost personalitzat.",
    en: "Select the services you need and request a custom quote.",
    fr: "Sélectionnez les services dont vous avez besoin et demandez un devis personnalisé.",
    de: "Wählen Sie die gewünschten Dienste aus und fordern Sie ein individuelles Angebot an.",
    it: "Seleziona i servizi di cui hai bisogno e richiedi un preventivo personalizzato."
  },
  configuratorCta: {
    es: "Continuar y Solicitar Presupuesto",
    ca: "Continuar i Sol·licitar Pressupost",
    en: "Continue to Quote Request",
    fr: "Continuer vers la demande de devis",
    de: "Weiter zur Angebotsanfrage",
    it: "Continua per Richiedere Preventivo"
  },
  chatTitle: {
    es: "Asistente Virtual EportsTech",
    ca: "Assistent Virtual EportsTech",
    en: "EportsTech Virtual Assistant",
    fr: "Assistant Virtuel EportsTech",
    de: "Virtueller Assistent EportsTech",
    it: "Assistente Virtuale EportsTech"
  },
  contactTitle: {
    es: "Hablemos",
    ca: "Parlem-ne",
    en: "Let's Talk",
    fr: "Parlons",
    de: "Lass uns reden",
    it: "Parliamo"
  },
  wizardNext: {
    es: "Siguiente", ca: "Següent", en: "Next", fr: "Suivant", de: "Weiter", it: "Avanti"
  },
  wizardBack: {
    es: "Atrás", ca: "Enrere", en: "Back", fr: "Retour", de: "Zurück", it: "Indietro"
  },
  wizardFinish: {
    es: "Ver Recomendación", ca: "Veure Recomanació", en: "See Recommendation", fr: "Voir Recommandation", de: "Empfehlung ansehen", it: "Vedi Raccomandazione"
  },
  analyzing: {
    es: "Analizando necesidades...", ca: "Analitzant necessitats...", en: "Analyzing needs...", fr: "Analyse des besoins...", de: "Bedürfnisse analysieren...", it: "Analizzando i bisogni..."
  },
  essentialPack: {
    es: "Paquete Esencial (Alta Prioridad)", ca: "Paquet Essencial (Alta Prioritat)", en: "Essential Package (High Priority)", fr: "Paquet Essentiel (Haute Priorité)", de: "Wesentliches Paket (Hohe Priorität)", it: "Pacchetto Essenziale (Alta Priorità)"
  },
  recommendedPack: {
    es: "Paquete Recomendado (Opcional)", ca: "Paquet Recomanat (Opcional)", en: "Recommended Package (Optional)", fr: "Paquet Recommandé (Optionnel)", de: "Empfohlenes Paket (Optional)", it: "Pacchetto Consigliato (Opzionale)"
  },
  restartWizard: {
    es: "Reiniciar Asistente", ca: "Reiniciar Assistent", en: "Restart Wizard", fr: "Redémarrer Assistant", de: "Assistent neu starten", it: "Riavvia Assistente"
  },
  insightTitle: {
    es: "Perspectivas del Mercado", ca: "Perspectives del Mercat", en: "Market Insights", fr: "Aperçu du Marché", de: "Markteinblicke", it: "Approfondimenti di Mercato"
  },
  insight1: {
    es: "Las empresas que invierten en transformación digital aumentan sus ingresos un 23%.",
    ca: "Les empreses que inverteixen en transformació digital augmenten els ingressos un 23%.",
    en: "Companies investing in digital transformation increase revenue by 23%.",
    fr: "Les entreprises investissant dans la transformation numérique augmentent leurs revenus de 23%.",
    de: "Unternehmen, die in digitale Transformation investieren, steigern ihren Umsatz um 23%.",
    it: "Le aziende che investono nella trasformazione digitale aumentano i ricavi del 23%."
  },
  insight2: {
    es: "El 60% de las PYMES sufren ciberataques. La prevención es clave.",
    ca: "El 60% de les PIMES pateixen ciberatacs. La prevenció és clau.",
    en: "60% of SMBs suffer cyberattacks. Prevention is key.",
    fr: "60% des PME subissent des cyberattaques. La prévention est la clé.",
    de: "60% der KMU erleiden Cyberangriffe. Prävention ist der Schlüssel.",
    it: "Il 60% delle PMI subisce attacchi informatici. La prevenzione è fondamentale."
  }
};

// Dynamic Insights based on Category
export const CATEGORY_INSIGHTS: Record<string, { growth: Record<string, string>, security: Record<string, string> }> = {
  [ServiceCategory.CONSULTING]: {
    growth: {
      es: "La digitalización de procesos reduce los costes operativos un 30% en el primer año.",
      ca: "La digitalització de processos redueix els costos operatius un 30% el primer any.",
      en: "Process digitalization reduces operational costs by 30% in the first year."
    },
    security: {
      es: "El 70% de los fallos de seguridad se deben a errores humanos y falta de protocolos.",
      ca: "El 70% de les fallades de seguretat es deuen a errors humans i manca de protocols.",
      en: "70% of security breaches are due to human error and lack of protocols."
    }
  },
  [ServiceCategory.CONNECTIVITY]: {
    growth: {
      es: "Una conexión de fibra dedicada aumenta la productividad del equipo en un 15%.",
      ca: "Una connexió de fibra dedicada augmenta la productivitat de l'equip en un 15%.",
      en: "A dedicated fiber connection increases team productivity by 15%."
    },
    security: {
      es: "El 99.9% de disponibilidad garantiza la continuidad del negocio ante fallos de red.",
      ca: "El 99.9% de disponibilitat garanteix la continuïtat del negoci davant fallades de xarxa.",
      en: "99.9% availability ensures business continuity in case of network failures."
    }
  },
  [ServiceCategory.CYBERSECURITY]: {
    growth: {
      es: "Las empresas con certificación de seguridad cierran contratos un 40% más rápido.",
      ca: "Les empreses amb certificació de seguretat tanquen contractes un 40% més ràpid.",
      en: "Companies with security certification close deals 40% faster."
    },
    security: {
      es: "Un ataque de ransomware cuesta de media 150.000€ a una PYME. Protege tus activos.",
      ca: "Un atac de ransomware costa de mitjana 150.000€ a una PIME. Protegeix els teus actius.",
      en: "A ransomware attack costs an average of €150k to an SMB. Protect your assets."
    }
  },
  [ServiceCategory.TELEPHONY]: {
    growth: {
      es: "La telefonía VoIP reduce la factura de comunicaciones hasta un 50% mensual.",
      ca: "La telefonia VoIP redueix la factura de comunicacions fins a un 50% mensual.",
      en: "VoIP telephony reduces the communications bill by up to 50% monthly."
    },
    security: {
      es: "Las comunicaciones cifradas evitan el espionaje industrial y la fuga de datos.",
      ca: "Les comunicacions xifrades eviten l'espionatge industrial i la fuga de dades.",
      en: "Encrypted communications prevent industrial espionage and data leakage."
    }
  },
  // Insights for the Configurator (Custom Package)
  'custom': {
    growth: {
        es: "Las soluciones a medida mejoran el ROI un 25% frente a paquetes estandarizados.",
        ca: "Les solucions a mida milloren el ROI un 25% enfront de paquets estandarditzats.",
        en: "Tailored solutions improve ROI by 25% compared to standardized packages.",
        fr: "Les solutions sur mesure améliorent le ROI de 25%.",
        de: "Maßgeschneiderte Lösungen verbessern den ROI um 25%.",
        it: "Le soluzioni su misura migliorano il ROI del 25%."
    },
    security: {
        es: "Un enfoque integral elimina brechas de seguridad entre proveedores desconectados.",
        ca: "Un enfocament integral elimina bretxes de seguretat entre proveïdors desconnectats.",
        en: "A comprehensive approach eliminates security gaps between disconnected providers.",
        fr: "Une approche globale élimine les failles de sécurité.",
        de: "Ein umfassender Ansatz beseitigt Sicherheitslücken.",
        it: "Un approccio globale elimina le lacune di sicurezza."
    }
  },
  // Default / General Inquiry
  'default': {
    growth: {
      es: "Las empresas que invierten en tecnología escalan 3 veces más rápido que sus competidores.",
      ca: "Les empreses que inverteixen en tecnologia escalen 3 vegades més ràpid que els competidors.",
      en: "Companies investing in technology scale 3x faster than competitors.",
      fr: "Les entreprises technologiques évoluent 3 fois plus vite.",
      de: "Technologieunternehmen skalieren dreimal schneller.",
      it: "Le aziende tecnologiche scalano 3 volte più velocemente."
    },
    security: {
      es: "La prevención tecnológica ahorra miles de euros en recuperaciones de desastres.",
      ca: "La prevenció tecnològica estalvia milers d'euros en recuperacions de desastres.",
      en: "Tech prevention saves thousands in disaster recovery costs.",
      fr: "La prévention technologique permet d'économiser des milliers d'euros.",
      de: "Technologieprävention spart Tausende Euro.",
      it: "La prevenzione tecnologica fa risparmiare migliaia di euro."
    }
  }
};

const rawServices: Omit<Service, 'visible' | 'order'>[] = [
  {
    id: '1',
    category: ServiceCategory.CONSULTING,
    icon: 'Briefcase',
    title: { es: 'Consultoría', ca: 'Consultoria', en: 'Consulting', fr: 'Consultant', de: 'Beratung', it: 'Consulenza' },
    description: { es: 'Transformación Digital, Procesos', ca: 'Transformació Digital, Processos', en: 'Digital Transformation, Processes', fr: 'Transformation Numérique, Processus', de: 'Digitale Transformation, Prozesse', it: 'Trasformazione Digitale, Processi' },
    extendedDescription: {
        es: "Acompañamiento estratégico integral. Analizamos la madurez digital de su empresa y diseñamos hojas de ruta para la digitalización de procesos, mejorando la eficiencia operativa y la toma de decisiones.",
        ca: "Acompanyament estratègic integral. Analitzem la maduresa digital de la seva empresa i dissenyem fulls de ruta per a la digitalització de processos.",
        en: "Comprehensive strategic support. We analyze your company's digital maturity and design roadmaps for process digitalization.",
        fr: "Soutien stratégique complet.",
        de: "Umfassende strategische Unterstützung.",
        it: "Supporto strategico completo."
    },
    features: {
        es: ["Transformación digital", "Digitalización de procesos"],
        ca: ["Transformació digital", "Digitalització de processos"],
        en: ["Digital Transformation", "Process Digitalization"],
        fr: ["Transformation numérique", "Numérisation des processus"],
        de: ["Digitale Transformation", "Prozessdigitalisierung"],
        it: ["Trasformazione digitale", "Digitalizzazione dei processi"]
    }
  },
  {
    id: '2',
    category: ServiceCategory.CONNECTIVITY,
    icon: 'Wifi',
    title: { es: 'Conectividad', ca: 'Connectivitat', en: 'Connectivity', fr: 'Connectivité', de: 'Konnektivität', it: 'Connettività' },
    description: { es: 'Fibra, Radio, Satélite, 4G/5G', ca: 'Fibra, Ràdio, Satèl·lit, 4G/5G', en: 'Fiber, Radio, Satellite, 4G/5G', fr: 'Fibre, Radio, Satellite, 4G/5G', de: 'Glasfaser, Funk, Satellit, 4G/5G', it: 'Fibra, Radio, Satellite, 4G/5G' },
    extendedDescription: {
        es: "Soluciones de acceso a Internet de alta disponibilidad. Integramos múltiples tecnologías para garantizar conexión en cualquier ubicación geográfica, con sistemas de respaldo automático.",
        ca: "Solucions d'accés a Internet d'alta disponibilitat. Integrem múltiples tecnologies per garantir connexió en qualsevol ubicació geogràfica.",
        en: "High availability Internet access solutions. We integrate multiple technologies to ensure connection in any geographical location.",
        fr: "Solutions d'accès Internet haute disponibilité.",
        de: "Hochverfügbare Internetzugangslösungen.",
        it: "Soluzioni di accesso a Internet ad alta disponibilità."
    },
    features: {
        es: ["Fibra óptica", "Radiofrecuencia", "Satélite", "4G/5G"],
        ca: ["Fibra òptica", "Radiofreqüència", "Satèl·lit", "4G/5G"],
        en: ["Fiber optic", "Radiofrequency", "Satellite", "4G/5G"],
        fr: ["Fibre optique", "Radiofréquence", "Satellite", "4G/5G"],
        de: ["Glasfaser", "Hochfrequenz", "Satellit", "4G/5G"],
        it: ["Fibra ottica", "Radiofrequenza", "Satellite", "4G/5G"]
    }
  },
  {
    id: '3',
    category: ServiceCategory.NETWORKING,
    icon: 'Network',
    title: { es: 'Networking', ca: 'Networking', en: 'Networking', fr: 'Réseautage', de: 'Vernetzung', it: 'Networking' },
    description: { es: 'Gestión IT, VPN, WIFI, SDWAN', ca: 'Gestió IT, VPN, WIFI, SDWAN', en: 'IT Mgmt, VPN, WIFI, SDWAN', fr: 'Gestion IT, VPN, WIFI, SDWAN', de: 'IT-Mgmt, VPN, WIFI, SDWAN', it: 'Gestione IT, VPN, WIFI, SDWAN' },
    extendedDescription: {
        es: "Arquitectura de redes avanzada para conectar sedes y usuarios. Gestión integral de la infraestructura de red, redes WiFi gestionadas de alta densidad y tecnología SD-WAN para optimizar el tráfico.",
        ca: "Arquitectura de xarxes avançada per connectar seus i usuaris. Gestió integral de la infraestructura de xarxa, xarxes WiFi gestionades i SD-WAN.",
        en: "Advanced network architecture to connect sites and users. Comprehensive network infrastructure management, managed WiFi, and SD-WAN.",
        fr: "Architecture réseau avancée pour connecter sites et utilisateurs.",
        de: "Fortschrittliche Netzwerkarchitektur zur Verbindung von Standorten und Benutzern.",
        it: "Architettura di rete avanzata per connettere sedi e utenti."
    },
    features: {
        es: ["Gestión integral IT", "VPN", "WIFI gestionada", "Redes multisede (SDWAN)"],
        ca: ["Gestió integral IT", "VPN", "WIFI gestionada", "Xarxes multiseu (SDWAN)"],
        en: ["Integral IT Management", "VPN", "Managed WIFI", "Multi-site networks (SDWAN)"],
        fr: ["Gestion IT intégrale", "VPN", "WIFI géré", "Réseaux multi-sites (SDWAN)"],
        de: ["Ganzheitliches IT-Management", "VPN", "Managed WIFI", "Standortübergreifende Netzwerke (SDWAN)"],
        it: ["Gestione IT integrale", "VPN", "WIFI gestito", "Reti multisede (SDWAN)"]
    }
  },
  {
    id: '4',
    category: ServiceCategory.CYBERSECURITY,
    icon: 'ShieldCheck',
    title: { es: 'Ciberseguridad', ca: 'Ciberseguretat', en: 'Cybersecurity', fr: 'Cybersécurité', de: 'Cybersicherheit', it: 'Sicurezza informatica' },
    description: { es: 'Auditoría, Firewall, EDR, Email', ca: 'Auditoria, Firewall, EDR, Email', en: 'Audit, Firewall, EDR, Email', fr: 'Audit, Pare-feu, EDR, Email', de: 'Audit, Firewall, EDR, E-Mail', it: 'Audit, Firewall, EDR, Email' },
    extendedDescription: {
        es: "Protección 360º para su empresa. Desde auditorías para detectar vulnerabilidades hasta firewalls gestionados (FWaaS), protección avanzada de dispositivos (EDR/XDR) y seguridad del correo electrónico.",
        ca: "Protecció 360º per a la seva empresa. Des d'auditories per detectar vulnerabilitats fins a firewalls gestionats (FWaaS), EDR/XDR i seguretat del correu.",
        en: "360º protection for your company. From audits to detect vulnerabilities to managed firewalls (FWaaS), EDR/XDR protection, and email security.",
        fr: "Protection 360º pour votre entreprise.",
        de: "360º-Schutz für Ihr Unternehmen.",
        it: "Protezione a 360º per la tua azienda."
    },
    features: {
        es: ["Auditoria de ciberseguridad", "Firewall (Fwaas)", "EDR/XDR (antivirus)", "Email security"],
        ca: ["Auditoria de ciberseguretat", "Firewall (Fwaas)", "EDR/XDR (antivirus)", "Email security"],
        en: ["Cybersecurity Audit", "Firewall (FWaaS)", "EDR/XDR (Antivirus)", "Email Security"],
        fr: ["Audit de cybersécurité", "Pare-feu (FWaaS)", "EDR/XDR (Antivirus)", "Sécurité des e-mails"],
        de: ["Cybersicherheitsaudit", "Firewall (FWaaS)", "EDR/XDR (Antivirus)", "E-Mail-Sicherheit"],
        it: ["Audit di sicurezza informatica", "Firewall (FWaaS)", "EDR/XDR (Antivirus)", "Sicurezza email"]
    }
  },
  {
    id: '5',
    category: ServiceCategory.IT_INFRASTRUCTURE,
    icon: 'Server',
    title: { es: 'Infraestructura IT', ca: 'Infraestructura IT', en: 'IT Infrastructure', fr: 'Infrastructure IT', de: 'IT-Infrastruktur', it: 'Infrastruttura IT' },
    description: { es: 'Identidad, Cloud, VPS, Backup', ca: 'Identitat, Cloud, VPS, Backup', en: 'Identity, Cloud, VPS, Backup', fr: 'Identité, Cloud, VPS, Sauvegarde', de: 'Identität, Cloud, VPS, Backup', it: 'Identità, Cloud, VPS, Backup' },
    extendedDescription: {
        es: "Soluciones de infraestructura robustas y escalables. Gestión de identidad digital corporativa, servidores en la nube (Cloud/VPS) y sistemas de copia de seguridad automatizados para garantizar la continuidad.",
        ca: "Solucions d'infraestructura robustes i escalables. Gestió d'identitat digital, servidors al núvol (Cloud/VPS) i sistemes de còpia de seguretat.",
        en: "Robust and scalable infrastructure solutions. Corporate digital identity management, cloud servers (Cloud/VPS), and automated backup systems.",
        fr: "Solutions d'infrastructure robustes et évolutives.",
        de: "Robuste und skalierbare Infrastrukturlösungen.",
        it: "Soluzioni infrastrutturali robuste e scalabili."
    },
    features: {
        es: ["Identidad digital", "Cloud", "VPS", "Backup de datos"],
        ca: ["Identitat digital", "Cloud", "VPS", "Backup de dades"],
        en: ["Digital Identity", "Cloud", "VPS", "Data Backup"],
        fr: ["Identité numérique", "Cloud", "VPS", "Sauvegarde de données"],
        de: ["Digitale Identität", "Cloud", "VPS", "Datensicherung"],
        it: ["Identità digitale", "Cloud", "VPS", "Backup di dati"]
    }
  },
  {
    id: '6',
    category: ServiceCategory.TELEPHONY,
    icon: 'Smartphone',
    title: { es: 'Telefonía', ca: 'Telefonia', en: 'Telephony', fr: 'Téléphonie', de: 'Telefonie', it: 'Telefonia' },
    description: { es: 'Centralita VoIP, Fija, Móvil', ca: 'Centraleta VoIP, Fixa, Mòbil', en: 'VoIP PBX, Fixed, Mobile', fr: 'PBX VoIP, Fixe, Mobile', de: 'VoIP-PBX, Festnetz, Mobil', it: 'PBX VoIP, Fisso, Mobile' },
    extendedDescription: {
        es: "Comunicaciones unificadas para la empresa moderna. Centralitas virtuales VoIP avanzadas, líneas fijas SIP Trunking y flotas de telefonía móvil corporativa con datos ilimitados.",
        ca: "Comunicacions unificades per a l'empresa moderna. Centraletes virtuals VoIP avançades, línies fixes i flotes de telefonia mòbil.",
        en: "Unified communications for the modern enterprise. Advanced virtual VoIP PBXs, fixed lines, and corporate mobile fleets.",
        fr: "Communications unifiées pour l'entreprise moderne.",
        de: "Unified Communications für das moderne Unternehmen.",
        it: "Comunicazioni unificate per l'azienda moderna."
    },
    features: {
        es: ["Centralita VoIP", "Telefonía fija", "Telefonía móvil"],
        ca: ["Centraleta VoIP", "Telefonia fixa", "Telefonia mòbil"],
        en: ["VoIP PBX", "Fixed Telephony", "Mobile Telephony"],
        fr: ["PBX VoIP", "Téléphonie fixe", "Téléphonie mobile"],
        de: ["VoIP-TK-Anlage", "Festnetztelefonie", "Mobilfunk"],
        it: ["Centralino VoIP", "Telefonia fissa", "Telefonia mobile"]
    }
  },
  {
    id: '7',
    category: ServiceCategory.IOT,
    icon: 'Cpu',
    title: { es: 'Sistemas IoT', ca: 'Sistemes IoT', en: 'IoT Systems', fr: 'Systèmes IoT', de: 'IoT-Systeme', it: 'Sistemi IoT' },
    description: { es: 'Eficiencia Energética (MODI)', ca: 'Eficiència Energètica (MODI)', en: 'Energy Efficiency (MODI)', fr: 'Efficacité Énergétique (MODI)', de: 'Energieeffizienz (MODI)', it: 'Efficienza Energetica (MODI)' },
    extendedDescription: {
        es: "Plataformas de Internet de las Cosas para la monitorización y control. Especializados en la plataforma MODI Efficiency para la gestión y ahorro energético en instalaciones industriales y oficinas.",
        ca: "Plataformes d'Internet de les Coses per al monitoratge i control. Especialitzats en la plataforma MODI Efficiency per a l'estalvi energètic.",
        en: "IoT platforms for monitoring and control. Specialized in the MODI Efficiency platform for energy management and savings.",
        fr: "Plateformes IoT pour la surveillance et le contrôle.",
        de: "IoT-Plattformen zur Überwachung und Steuerung.",
        it: "Piattaforme IoT per monitoraggio e controllo."
    },
    features: {
        es: ["Plataforma de eficiencia energética MODI Efficiency"],
        ca: ["Plataforma d'eficiència energètica MODI Efficiency"],
        en: ["MODI Efficiency Energy Platform"],
        fr: ["Plateforme d'efficacité énergétique MODI"],
        de: ["MODI-Energieeffizienzplattform"],
        it: ["Piattaforma di efficienza energetica MODI"]
    }
  },
  {
    id: '8',
    category: ServiceCategory.SECURITY,
    icon: 'Camera',
    title: { es: 'Seguridad', ca: 'Seguretat', en: 'Security', fr: 'Sécurité', de: 'Sicherheit', it: 'Sicurezza' },
    description: { es: 'Videovigilancia (CCTV)', ca: 'Videovigilància (CCTV)', en: 'Video Surveillance (CCTV)', fr: 'Vidéosurveillance (CCTV)', de: 'Videoüberwachung (CCTV)', it: 'Videosorveglianza (CCTV)' },
    extendedDescription: {
        es: "Sistemas avanzados de seguridad física. Cámaras de videovigilancia IP de alta resolución, control de accesos y sistemas de grabación para la protección integral de instalaciones.",
        ca: "Sistemes avançats de seguretat física. Càmeres de videovigilància IP, control d'accessos i sistemes d'enregistrament per a la protecció integral d'instal·lacions.",
        en: "Advanced physical security systems. High-resolution IP video surveillance cameras, access control, and recording systems for comprehensive facility protection.",
        fr: "Systèmes de sécurité physique avancés. Caméras de vidéosurveillance IP, contrôle d'accès et systèmes d'enregistrement pour la protection complète.",
        de: "Fortschrittliche physische Sicherheitssysteme. IP-Videoüberwachungskameras, Zugangskontrolle und Aufzeichnungssysteme für den umfassenden Schutz.",
        it: "Sistemi di sicurezza fisica avanzati. Telecamere di videosorveglianza IP, controllo accessi e sistemi di registrazione per la protezione completa."
    },
    features: {
        es: ["Videovigilancia"],
        ca: ["Videovigilància"],
        en: ["Video Surveillance"],
        fr: ["Vidéosurveillance"],
        de: ["Videoüberwachung"],
        it: ["Videosorveglianza"]
    }
  }
];

export const SERVICES_DATA: Service[] = rawServices.map((service, index) => ({
    ...service,
    visible: true,
    order: index
}));

// Helper to generate configurator items from services
const generateConfiguratorItems = (): ConfiguratorItem[] => {
  const items: ConfiguratorItem[] = [];
  let globalOrder = 0;

  const defaultBenefits: Record<string, Record<string, string>> = {
    [ServiceCategory.CONSULTING]: { es: "Estrategia y eficiencia", ca: "Estratègia i eficiència", en: "Strategy and efficiency", fr: "Stratégie et efficacité", de: "Strategie und Effizienz", it: "Strategia ed efficienza" },
    [ServiceCategory.CONNECTIVITY]: { es: "Alta velocidad garantizada", ca: "Alta velocitat garantida", en: "Guaranteed high speed", fr: "Haute vitesse garantie", de: "Garantierte hohe Geschwindigkeit", it: "Alta velocità garantita" },
    [ServiceCategory.NETWORKING]: { es: "Redes seguras y estables", ca: "Xarxes segures i estables", en: "Secure and stable networks", fr: "Réseaux sécurisés et stables", de: "Sichere und stabile Netzwerke", it: "Reti sicure e stabili" },
    [ServiceCategory.CYBERSECURITY]: { es: "Protección de activos", ca: "Protecció d'actius", en: "Asset protection", fr: "Protection des actifs", de: "Vermögensschutz", it: "Protezione degli asset" },
    [ServiceCategory.IT_INFRASTRUCTURE]: { es: "Infraestructura escalable", ca: "Infraestructura escalable", en: "Scalable infrastructure", fr: "Infrastructure évolutive", de: "Skalierbare Infrastruktur", it: "Infrastruttura scalabile" },
    [ServiceCategory.TELEPHONY]: { es: "Comunicaciones unificadas", ca: "Comunicacions unificades", en: "Unified communications", fr: "Communications unifiées", de: "Unified Communications", it: "Comunicazioni unificate" },
    [ServiceCategory.IOT]: { es: "Control y ahorro", ca: "Control i estalvi", en: "Control and savings", fr: "Contrôle et économies", de: "Kontrolle und Einsparungen", it: "Controllo e risparmio" },
    [ServiceCategory.SECURITY]: { es: "Vigilancia 24/7", ca: "Vigilància 24/7", en: "24/7 Surveillance", fr: "Surveillance 24/7", de: "24/7 Überwachung", it: "Sorveglianza 24/7" }
  };

  rawServices.forEach((service) => {
    // Check if features exist for 'es' as base
    const baseFeatures = service.features?.es || [];
    
    baseFeatures.forEach((_, index) => {
       const titleObj: any = {};
       SUPPORTED_LANGUAGES.forEach(lang => {
          // Fallback to English or Spanish if specific lang feature is missing
          const featList = service.features?.[lang.code as any] || service.features?.es || [];
          titleObj[lang.code] = featList[index] || featList[0] || "Service";
       });

       // Get benefit or default
       const benefitObj: any = {};
        SUPPORTED_LANGUAGES.forEach(lang => {
          const catBenefits = defaultBenefits[service.category] || defaultBenefits[ServiceCategory.CONSULTING];
          benefitObj[lang.code] = catBenefits[lang.code as any] || catBenefits['en'];
       });

       items.push({
         id: `conf-${service.category}-${index}`,
         category: service.category as ServiceCategory,
         icon: service.icon,
         title: titleObj,
         benefit: benefitObj,
         visible: true,
         order: globalOrder++
       });
    });
  });

  return items;
};

export const CONFIGURATOR_ITEMS: ConfiguratorItem[] = generateConfiguratorItems();

export const WIZARD_STEPS: WizardStep[] = [];
