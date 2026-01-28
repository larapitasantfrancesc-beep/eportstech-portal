-- EportsTech Portal - Supabase Schema Initialization
-- Ejecutar en: Project → SQL Editor
-- Requiere: Proyecto Supabase creado

-- ============================================
-- 1. BRAND CONFIGURATION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS brand_config (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  siteName TEXT NOT NULL DEFAULT 'EportsTech Portal',
  favicon TEXT,
  navLogo TEXT DEFAULT '/logo-blue.png',
  footerLogo TEXT DEFAULT '/logo-white.png',
  contactEmail TEXT DEFAULT 'contact@eportstech.com',
  contactPhone TEXT DEFAULT '+34 900 123 456',
  heroImage TEXT DEFAULT '/hq-background.jpg',
  heroTitle JSONB DEFAULT '{"es":"","ca":"","en":"","fr":"","de":"","it":""}',
  heroSubtitle JSONB DEFAULT '{"es":"","ca":"","en":"","fr":"","de":"","it":""}',
  heroCtaText JSONB DEFAULT '{"es":"","ca":"","en":"","fr":"","de":"","it":""}',
  heroOverlayOpacity DECIMAL(3,2) DEFAULT 0.6,
  heroPosition TEXT DEFAULT 'center',
  benefitsTitle JSONB,
  benefitsSubtitle JSONB,
  benefitsItems JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. LEADS TABLE (Contact Form Submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  fullName TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  serviceInterest TEXT,
  message TEXT NOT NULL,
  address TEXT,
  city TEXT,
  source TEXT DEFAULT 'contact-form',
  status TEXT DEFAULT 'new',
  notes TEXT,
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. CONFIGURATOR LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS configurator_leads (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  fullName TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  selectedItems JSONB NOT NULL,
  estimatedValue DECIMAL(12,2),
  status TEXT DEFAULT 'pending',
  notes TEXT,
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. CHATBOT CONFIGURATION
-- ============================================
CREATE TABLE IF NOT EXISTS bot_config (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT DEFAULT 'EportsTech Assistant',
  tone TEXT DEFAULT 'professional',
  responseLength TEXT DEFAULT 'balanced',
  highlightedProduct TEXT,
  businessHoursStart TEXT DEFAULT '09:00',
  businessHoursEnd TEXT DEFAULT '18:00',
  timezone TEXT DEFAULT 'Europe/Madrid',
  limitations JSONB,
  qualifyingQuestions JSONB,
  customInstructions TEXT,
  knowledgeBase JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. NOTIFICATION SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS notification_settings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  emailRecipients JSONB NOT NULL,
  notifyOnLead BOOLEAN DEFAULT true,
  notifyOnConfigurator BOOLEAN DEFAULT true,
  notifyOnNewsletter BOOLEAN DEFAULT false,
  emailTemplate TEXT DEFAULT 'default',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. SERVICES TABLE (Dynamic Services)
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  icon TEXT,
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  extendedDescription JSONB,
  features JSONB,
  category TEXT,
  visible BOOLEAN DEFAULT true,
  order_idx INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. CONFIGURATOR ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS configurator_items (
  id TEXT PRIMARY KEY,
  icon TEXT,
  category TEXT,
  title JSONB NOT NULL,
  benefit JSONB NOT NULL,
  visible BOOLEAN DEFAULT true,
  order_idx INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. USERS TABLE (Admin Users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  fullName TEXT,
  lastLogin TIMESTAMP WITH TIME ZONE,
  isActive BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. ACTIVITY LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activity_log (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  userId UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entityType TEXT,
  entityId TEXT,
  changes JSONB,
  ipAddress TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 10. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_company ON leads(company);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_configurator_created ON configurator_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_configurator_email ON configurator_leads(email);
CREATE INDEX IF NOT EXISTS idx_services_visible_order ON services(visible, order_idx);
CREATE INDEX IF NOT EXISTS idx_configurator_items_visible ON configurator_items(visible);
CREATE INDEX IF NOT EXISTS idx_activity_userId ON activity_log(userId);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at DESC);

-- ============================================
-- 11. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE brand_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurator_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurator_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- BRAND_CONFIG: Readable by all, writable only by admins
CREATE POLICY "brand_config_read" ON brand_config
  FOR SELECT USING (true);

CREATE POLICY "brand_config_write" ON brand_config
  FOR UPDATE USING (auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "brand_config_insert" ON brand_config
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- LEADS: Insertable by all, readable/writable only by admins
CREATE POLICY "leads_insert" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "leads_read" ON leads
  FOR SELECT USING (auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "leads_update" ON leads
  FOR UPDATE USING (auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- CONFIGURATOR_LEADS: Insertable by all, readable/writable only by admins
CREATE POLICY "configurator_leads_insert" ON configurator_leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "configurator_leads_read" ON configurator_leads
  FOR SELECT USING (auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- BOT_CONFIG: Readable by all, writable only by admins
CREATE POLICY "bot_config_read" ON bot_config
  FOR SELECT USING (true);

CREATE POLICY "bot_config_write" ON bot_config
  FOR UPDATE USING (auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- SERVICES: Readable by all, writable only by admins
CREATE POLICY "services_read" ON services
  FOR SELECT USING (true);

CREATE POLICY "services_write" ON services
  FOR ALL USING (auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- CONFIGURATOR_ITEMS: Readable by all, writable only by admins
CREATE POLICY "configurator_items_read" ON configurator_items
  FOR SELECT USING (true);

CREATE POLICY "configurator_items_write" ON configurator_items
  FOR ALL USING (auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- 12. FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_brand_config_updated_at
  BEFORE UPDATE ON brand_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_configurator_leads_updated_at
  BEFORE UPDATE ON configurator_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_configurator_items_updated_at
  BEFORE UPDATE ON configurator_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 13. INITIAL DATA (OPTIONAL)
-- ============================================

-- Insert initial brand config (edit with your values)
INSERT INTO brand_config (siteName, contactEmail, contactPhone)
VALUES ('EportsTech Portal', 'contact@eportstech.com', '+34 900 123 456')
ON CONFLICT DO NOTHING;

-- Insert initial bot config
INSERT INTO bot_config (name, tone, responseLength)
VALUES ('EportsTech Assistant', 'professional', 'balanced')
ON CONFLICT DO NOTHING;

-- Insert initial notification settings
INSERT INTO notification_settings (emailRecipients, notifyOnLead, notifyOnConfigurator)
VALUES ('["admin@eportstech.com"]'::jsonb, true, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 14. STORAGE BUCKETS (Execute in Storage section)
-- ============================================
-- Note: These must be created via Supabase UI or Storage API
-- Bucket 1: brand-assets (for logos, images)
-- Bucket 2: uploads (for user uploads)
-- Both buckets should have public read access

-- ============================================
-- 15. VERIFICATION QUERIES
-- ============================================

-- Check created tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY indexname;

-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
