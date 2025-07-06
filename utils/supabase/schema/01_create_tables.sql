-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  technologies TEXT[] NOT NULL,
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  image_url VARCHAR(500),
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  proficiency INTEGER CHECK (proficiency >= 1 AND proficiency <= 100),
  icon_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  location VARCHAR(255),
  technologies TEXT[],
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table
CREATE TABLE IF NOT EXISTS links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  description TEXT,
  icon_name VARCHAR(100),
  background_color VARCHAR(50) DEFAULT '#8b5cf6',
  text_color VARCHAR(50) DEFAULT '#ffffff',
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create link_clicks table for analytics
CREATE TABLE IF NOT EXISTS link_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT
);

-- Create profile_settings table for customization
CREATE TABLE IF NOT EXISTS profile_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_name VARCHAR(255) DEFAULT 'DevJoseH',
  profile_bio TEXT DEFAULT 'Desenvolvedor Backend | Criador de Soluções Escaláveis',
  profile_image_url VARCHAR(500),
  background_type VARCHAR(50) DEFAULT 'gradient', -- gradient, solid, image
  background_value TEXT DEFAULT 'from-purple-900 via-gray-900 to-purple-900',
  theme VARCHAR(50) DEFAULT 'dark',
  custom_css TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hackathons table
CREATE TABLE IF NOT EXISTS hackathons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date VARCHAR(100) NOT NULL,
  cover_image_url VARCHAR(500),
  placement VARCHAR(100) NOT NULL,
  placement_type VARCHAR(50) NOT NULL CHECK (placement_type IN ('winner', 'finalist', 'participant')),
  description TEXT NOT NULL,
  photos JSONB DEFAULT '[]',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_experiences_current ON experiences(is_current);
CREATE INDEX IF NOT EXISTS idx_links_active_order ON links(is_active, order_index);
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_date ON link_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_hackathons_active_order ON hackathons(is_active, order_index);