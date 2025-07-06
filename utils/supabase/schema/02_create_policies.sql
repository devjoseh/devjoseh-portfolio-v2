-- Enable Row Level Security (RLS) for all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROJECTS TABLE POLICIES
-- ============================================

-- Allow public read access to all projects
CREATE POLICY "Public can view all projects" ON projects
  FOR SELECT USING (true);

-- Allow authenticated users (admin) to insert projects
CREATE POLICY "Authenticated users can insert projects" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to update projects
CREATE POLICY "Authenticated users can update projects" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to delete projects
CREATE POLICY "Authenticated users can delete projects" ON projects
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- SKILLS TABLE POLICIES
-- ============================================

-- Allow public read access to all skills
CREATE POLICY "Public can view all skills" ON skills
  FOR SELECT USING (true);

-- Allow authenticated users (admin) to insert skills
CREATE POLICY "Authenticated users can insert skills" ON skills
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to update skills
CREATE POLICY "Authenticated users can update skills" ON skills
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to delete skills
CREATE POLICY "Authenticated users can delete skills" ON skills
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- EXPERIENCES TABLE POLICIES
-- ============================================

-- Allow public read access to all experiences
CREATE POLICY "Public can view all experiences" ON experiences
  FOR SELECT USING (true);

-- Allow authenticated users (admin) to insert experiences
CREATE POLICY "Authenticated users can insert experiences" ON experiences
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to update experiences
CREATE POLICY "Authenticated users can update experiences" ON experiences
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to delete experiences
CREATE POLICY "Authenticated users can delete experiences" ON experiences
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- LINKS TABLE POLICIES
-- ============================================

-- Allow public read access to active links only
CREATE POLICY "Public can view active links" ON links
  FOR SELECT USING (is_active = true);

-- Allow authenticated users (admin) to view all links (including inactive)
CREATE POLICY "Admin can view all links" ON links
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to insert links
CREATE POLICY "Admin can insert links" ON links
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to update links
CREATE POLICY "Admin can update links" ON links
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to delete links
CREATE POLICY "Admin can delete links" ON links
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- LINK_CLICKS TABLE POLICIES
-- ============================================

-- Allow public insert access for click tracking
-- This allows anyone to create click records when they click a link
CREATE POLICY "Public can create click records" ON link_clicks
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admin) to view all click analytics
CREATE POLICY "Admin can view click analytics" ON link_clicks
  FOR SELECT USING (auth.role() = 'authenticated');

-- Prevent public from reading click data (privacy)
-- No public SELECT policy = no public read access

-- Allow authenticated users (admin) to delete click records (cleanup)
CREATE POLICY "Admin can delete click records" ON link_clicks
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- PROFILE_SETTINGS TABLE POLICIES
-- ============================================

-- Allow public read access to profile settings
CREATE POLICY "Public can view profile settings" ON profile_settings
  FOR SELECT USING (true);

-- Allow authenticated users (admin) to update profile settings
CREATE POLICY "Admin can update profile settings" ON profile_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to insert profile settings
CREATE POLICY "Admin can insert profile settings" ON profile_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to delete profile settings
CREATE POLICY "Admin can delete profile settings" ON profile_settings
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- FUNCTIONS SECURITY SETTINGS
-- ============================================

-- Set security definer for reorder functions (admin only)
ALTER FUNCTION reorder_experiences(UUID[]) SECURITY DEFINER;
ALTER FUNCTION reorder_projects(UUID[]) SECURITY DEFINER;
ALTER FUNCTION reorder_links(UUID[]) SECURITY DEFINER;
ALTER FUNCTION reorder_hackathons(UUID[]) SECURITY DEFINER;

-- Grant execute permissions only to authenticated users (admin)
GRANT EXECUTE ON FUNCTION reorder_experiences TO authenticated;
GRANT EXECUTE ON FUNCTION reorder_projects TO authenticated;
GRANT EXECUTE ON FUNCTION reorder_links TO authenticated;
GRANT EXECUTE ON FUNCTION reorder_hackathons TO authenticated;

-- Revoke execute permissions from public (security)
REVOKE EXECUTE ON FUNCTION reorder_experiences FROM public;
REVOKE EXECUTE ON FUNCTION reorder_projects FROM public;
REVOKE EXECUTE ON FUNCTION reorder_links FROM public;
REVOKE EXECUTE ON FUNCTION reorder_hackathons FROM public;

-- ============================================
-- HACKATHONS TABLE POLICIES
-- ============================================

-- Allow public read access to active hackathons only
CREATE POLICY "Public can view active hackathons" ON hackathons
  FOR SELECT USING (is_active = true);

-- Allow authenticated users (admin) to view all hackathons
CREATE POLICY "Admin can view all hackathons" ON hackathons
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to insert hackathons
CREATE POLICY "Admin can insert hackathons" ON hackathons
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to update hackathons
CREATE POLICY "Admin can update hackathons" ON hackathons
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to delete hackathons
CREATE POLICY "Admin can delete hackathons" ON hackathons
  FOR DELETE USING (auth.role() = 'authenticated');