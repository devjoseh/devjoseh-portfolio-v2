-- Create function to increment link clicks
CREATE OR REPLACE FUNCTION increment_link_clicks(link_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE links 
  SET click_count = click_count + 1, updated_at = NOW()
  WHERE id = link_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to reorder experiences
CREATE OR REPLACE FUNCTION reorder_experiences(experience_ids UUID[])
RETURNS void AS $$
DECLARE
  i INTEGER;
BEGIN
  FOR i IN 1..array_length(experience_ids, 1) LOOP
    UPDATE experiences 
    SET order_index = i, updated_at = NOW()
    WHERE id = experience_ids[i];
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to reorder projects
CREATE OR REPLACE FUNCTION reorder_projects(project_ids UUID[])
RETURNS void AS $$
DECLARE
  i INTEGER;
BEGIN
  FOR i IN 1..array_length(project_ids, 1) LOOP
    UPDATE projects 
    SET order_index = i, updated_at = NOW()
    WHERE id = project_ids[i];
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to reorder links
CREATE OR REPLACE FUNCTION reorder_links(link_ids UUID[])
RETURNS void AS $$
DECLARE
  i INTEGER;
BEGIN
  FOR i IN 1..array_length(link_ids, 1) LOOP
    UPDATE links 
    SET order_index = i, updated_at = NOW()
    WHERE id = link_ids[i];
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to reorder hackathons
CREATE OR REPLACE FUNCTION reorder_hackathons(hackathon_ids UUID[])
RETURNS void AS $$
DECLARE
  i INTEGER;
BEGIN
  FOR i IN 1..array_length(hackathon_ids, 1) LOOP
    UPDATE hackathons 
    SET order_index = i, updated_at = NOW()
    WHERE id = hackathon_ids[i];
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to update updated_at timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';