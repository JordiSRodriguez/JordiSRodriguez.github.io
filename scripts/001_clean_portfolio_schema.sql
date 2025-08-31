-- Clean Portfolio Schema - Essential tables only
-- This replaces all the previous migration files

-- Basic profile table for portfolio owner
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  github_username TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress', 'planned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work experiences table
CREATE TABLE IF NOT EXISTS public.work_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  company_url TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency_level INTEGER DEFAULT 1 CHECK (proficiency_level BETWEEN 1 AND 5),
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  gpa TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio likes (for the interactive like feature)
CREATE TABLE IF NOT EXISTS public.portfolio_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT, -- Could be IP or session ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simple contact form submissions
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visitor feedback
CREATE TABLE IF NOT EXISTS public.visitor_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  feedback TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simple visit tracking
CREATE TABLE IF NOT EXISTS public.visit_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT,
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simple public access policies (no complex RLS)
-- Enable RLS but with simple "allow all reads" policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_stats ENABLE ROW LEVEL SECURITY;

-- Simple policies: read for everyone, write restricted
CREATE POLICY "public_read_profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "public_read_projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "public_read_work_experiences" ON public.work_experiences FOR SELECT USING (true);
CREATE POLICY "public_read_skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "public_read_education" ON public.education FOR SELECT USING (true);

-- Portfolio likes: anyone can read and insert (for the like feature)
CREATE POLICY "public_read_portfolio_likes" ON public.portfolio_likes FOR SELECT USING (true);
CREATE POLICY "public_insert_portfolio_likes" ON public.portfolio_likes FOR INSERT WITH CHECK (true);

-- Contact forms: anyone can insert
CREATE POLICY "public_insert_contacts" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_visitor_feedback" ON public.visitor_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_visit_stats" ON public.visit_stats FOR INSERT WITH CHECK (true);

-- Additional read policies for tables that might be missing them
CREATE POLICY "public_read_visitor_feedback" ON public.visitor_feedback FOR SELECT USING (true);
CREATE POLICY "public_read_visit_stats" ON public.visit_stats FOR SELECT USING (true);
CREATE POLICY "public_read_contacts" ON public.contacts FOR SELECT USING (true);

-- Enable realtime for portfolio likes
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_likes;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_work_experiences_updated_at
  BEFORE UPDATE ON public.work_experiences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
