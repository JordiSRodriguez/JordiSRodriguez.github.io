-- =====================================================
-- PORTFOLIO DATABASE SCHEMA - Clean Setup
-- =====================================================
-- Este script crea todas las tablas necesarias para el portfolio
-- Incluye RLS (Row Level Security) configurado para acceso público de lectura
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: profiles
-- Información personal del portfolio
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    github_username TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    location TEXT,
    roles TEXT[],
    initials TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: projects
-- Proyectos del portfolio
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    github_url TEXT,
    demo_url TEXT,
    image_url TEXT,
    technologies TEXT[],
    featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress', 'planning')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: work_experiences
-- Experiencias laborales
-- =====================================================
CREATE TABLE IF NOT EXISTS work_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    position TEXT,
    description TEXT,
    location TEXT,
    company_url TEXT,
    logo_url TEXT,
    technologies TEXT[],
    start_date DATE,
    end_date DATE,
    current_job BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: experiences (para educación y otros tipos)
-- Experiencias generales (educación, cursos, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    description TEXT,
    type TEXT DEFAULT 'education' CHECK (type IN ('education', 'course', 'workshop', 'conference')),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: skills
-- Habilidades técnicas y niveles
-- =====================================================
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    level INTEGER DEFAULT 3 CHECK (level >= 1 AND level <= 5),
    icon TEXT,
    color TEXT,
    years_experience INTEGER DEFAULT 0,
    description TEXT,
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: interests
-- Intereses personales
-- =====================================================
CREATE TABLE IF NOT EXISTS interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    category TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: fun_facts
-- Datos curiosos y estadísticas personales
-- =====================================================
CREATE TABLE IF NOT EXISTS fun_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    value TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: certifications
-- Certificaciones profesionales
-- =====================================================
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date DATE,
    credential_id TEXT,
    icon TEXT,
    color TEXT,
    verification_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: courses
-- Cursos online y formación complementaria
-- =====================================================
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    duration TEXT,
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress', 'planned')),
    grade TEXT,
    completion_date DATE,
    start_date DATE,
    course_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: learning_goals
-- Objetivos de aprendizaje y metas profesionales
-- =====================================================
CREATE TABLE IF NOT EXISTS learning_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT,
    priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
    target_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: blog_posts
-- Posts del blog
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    excerpt TEXT,
    content TEXT,
    tags TEXT[],
    published BOOLEAN DEFAULT FALSE,
    featured_image TEXT,
    reading_time INTEGER DEFAULT 5,
    views INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: meetings
-- Sistema de agendamiento de reuniones
-- =====================================================
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    meeting_type TEXT DEFAULT 'consultation' CHECK (meeting_type IN ('consultation', 'technical', 'collaboration', 'mentoring')),
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    duration INTEGER DEFAULT 30,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: contacts
-- Mensajes de contacto del formulario
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: visitor_feedback
-- Feedback y comentarios de visitantes
-- =====================================================
CREATE TABLE IF NOT EXISTS visitor_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    type TEXT DEFAULT 'general' CHECK (type IN ('general', 'project', 'design', 'suggestion')),
    is_public BOOLEAN DEFAULT TRUE,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: portfolio_likes
-- Sistema de likes del portfolio (tiempo real)
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolio_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_id TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: visit_stats
-- Estadísticas de visitas
-- =====================================================
CREATE TABLE IF NOT EXISTS visit_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_id TEXT NOT NULL,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- Índices para projects
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Índices para work_experiences
CREATE INDEX IF NOT EXISTS idx_work_experiences_current_job ON work_experiences(current_job);
CREATE INDEX IF NOT EXISTS idx_work_experiences_start_date ON work_experiences(start_date DESC);

-- Índices para experiences
CREATE INDEX IF NOT EXISTS idx_experiences_type ON experiences(type);
CREATE INDEX IF NOT EXISTS idx_experiences_start_date ON experiences(start_date DESC);

-- Índices para skills
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_featured ON skills(featured);
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON skills(display_order);

-- Índices para interests
CREATE INDEX IF NOT EXISTS idx_interests_category ON interests(category);
CREATE INDEX IF NOT EXISTS idx_interests_display_order ON interests(display_order);

-- Índices para fun_facts
CREATE INDEX IF NOT EXISTS idx_fun_facts_display_order ON fun_facts(display_order);

-- Índices para certifications
CREATE INDEX IF NOT EXISTS idx_certifications_date ON certifications(date DESC);
CREATE INDEX IF NOT EXISTS idx_certifications_display_order ON certifications(display_order);

-- Índices para courses
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_completion_date ON courses(completion_date DESC);
CREATE INDEX IF NOT EXISTS idx_courses_display_order ON courses(display_order);

-- Índices para learning_goals
CREATE INDEX IF NOT EXISTS idx_learning_goals_category ON learning_goals(category);
CREATE INDEX IF NOT EXISTS idx_learning_goals_is_completed ON learning_goals(is_completed);
CREATE INDEX IF NOT EXISTS idx_learning_goals_priority ON learning_goals(priority);
CREATE INDEX IF NOT EXISTS idx_learning_goals_display_order ON learning_goals(display_order);

-- Índices para blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_views ON blog_posts(views DESC);

-- Índices para meetings
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_preferred_date ON meetings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_meetings_meeting_type ON meetings(meeting_type);
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON meetings(created_at DESC);

-- Índices para contacts
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- Índices para visitor_feedback
CREATE INDEX IF NOT EXISTS idx_visitor_feedback_is_public ON visitor_feedback(is_public);
CREATE INDEX IF NOT EXISTS idx_visitor_feedback_type ON visitor_feedback(type);
CREATE INDEX IF NOT EXISTS idx_visitor_feedback_rating ON visitor_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_visitor_feedback_created_at ON visitor_feedback(created_at DESC);

-- Índices para portfolio_likes
CREATE INDEX IF NOT EXISTS idx_portfolio_likes_visitor_id ON portfolio_likes(visitor_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_likes_created_at ON portfolio_likes(created_at DESC);

-- Índices para visit_stats
CREATE INDEX IF NOT EXISTS idx_visit_stats_visitor_id ON visit_stats(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visit_stats_page_url ON visit_stats(page_url);
CREATE INDEX IF NOT EXISTS idx_visit_stats_created_at ON visit_stats(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE fun_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_stats ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS DE SEGURIDAD
-- =====================================================

-- PROFILES: Lectura pública
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
CREATE POLICY "profiles_select_policy" 
    ON profiles FOR SELECT 
    USING (true);

-- PROJECTS: Lectura pública
DROP POLICY IF EXISTS "projects_select_policy" ON projects;
CREATE POLICY "projects_select_policy" 
    ON projects FOR SELECT 
    USING (true);

-- WORK_EXPERIENCES: Lectura pública
DROP POLICY IF EXISTS "work_experiences_select_policy" ON work_experiences;
CREATE POLICY "work_experiences_select_policy" 
    ON work_experiences FOR SELECT 
    USING (true);

-- EXPERIENCES: Lectura pública
DROP POLICY IF EXISTS "experiences_select_policy" ON experiences;
CREATE POLICY "experiences_select_policy" 
    ON experiences FOR SELECT 
    USING (true);

-- SKILLS: Lectura pública
DROP POLICY IF EXISTS "skills_select_policy" ON skills;
CREATE POLICY "skills_select_policy" 
    ON skills FOR SELECT 
    USING (true);

-- INTERESTS: Lectura pública
DROP POLICY IF EXISTS "interests_select_policy" ON interests;
CREATE POLICY "interests_select_policy" 
    ON interests FOR SELECT 
    USING (true);

-- FUN_FACTS: Lectura pública
DROP POLICY IF EXISTS "fun_facts_select_policy" ON fun_facts;
CREATE POLICY "fun_facts_select_policy" 
    ON fun_facts FOR SELECT 
    USING (true);

-- CERTIFICATIONS: Lectura pública
DROP POLICY IF EXISTS "certifications_select_policy" ON certifications;
CREATE POLICY "certifications_select_policy" 
    ON certifications FOR SELECT 
    USING (true);

-- COURSES: Lectura pública
DROP POLICY IF EXISTS "courses_select_policy" ON courses;
CREATE POLICY "courses_select_policy" 
    ON courses FOR SELECT 
    USING (true);

-- LEARNING_GOALS: Lectura pública
DROP POLICY IF EXISTS "learning_goals_select_policy" ON learning_goals;
CREATE POLICY "learning_goals_select_policy" 
    ON learning_goals FOR SELECT 
    USING (true);

-- BLOG_POSTS: Lectura pública solo para posts publicados
DROP POLICY IF EXISTS "blog_posts_select_policy" ON blog_posts;
CREATE POLICY "blog_posts_select_policy" 
    ON blog_posts FOR SELECT 
    USING (published = true);

-- MEETINGS: Solo inserción pública (para agendamiento)
DROP POLICY IF EXISTS "meetings_insert_policy" ON meetings;
CREATE POLICY "meetings_insert_policy" 
    ON meetings FOR INSERT 
    WITH CHECK (true);

-- CONTACTS: Solo inserción pública (para formulario de contacto)
DROP POLICY IF EXISTS "contacts_insert_policy" ON contacts;
CREATE POLICY "contacts_insert_policy" 
    ON contacts FOR INSERT 
    WITH CHECK (true);

-- VISITOR_FEEDBACK: Lectura e inserción pública
DROP POLICY IF EXISTS "visitor_feedback_select_policy" ON visitor_feedback;
CREATE POLICY "visitor_feedback_select_policy" 
    ON visitor_feedback FOR SELECT 
    USING (is_public = true);

DROP POLICY IF EXISTS "visitor_feedback_insert_policy" ON visitor_feedback;
CREATE POLICY "visitor_feedback_insert_policy" 
    ON visitor_feedback FOR INSERT 
    WITH CHECK (true);

-- PORTFOLIO_LIKES: Lectura e inserción pública (para sistema de likes)
DROP POLICY IF EXISTS "portfolio_likes_select_policy" ON portfolio_likes;
CREATE POLICY "portfolio_likes_select_policy" 
    ON portfolio_likes FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "portfolio_likes_insert_policy" ON portfolio_likes;
CREATE POLICY "portfolio_likes_insert_policy" 
    ON portfolio_likes FOR INSERT 
    WITH CHECK (true);

-- VISIT_STATS: Solo inserción pública (para analytics)
DROP POLICY IF EXISTS "visit_stats_insert_policy" ON visit_stats;
CREATE POLICY "visit_stats_insert_policy" 
    ON visit_stats FOR INSERT 
    WITH CHECK (true);

-- Política de lectura para visit_stats (solo conteo)
DROP POLICY IF EXISTS "visit_stats_select_policy" ON visit_stats;
CREATE POLICY "visit_stats_select_policy" 
    ON visit_stats FOR SELECT 
    USING (true);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at en todas las tablas relevantes
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_work_experiences_updated_at ON work_experiences;
CREATE TRIGGER update_work_experiences_updated_at 
    BEFORE UPDATE ON work_experiences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_experiences_updated_at ON experiences;
CREATE TRIGGER update_experiences_updated_at 
    BEFORE UPDATE ON experiences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at 
    BEFORE UPDATE ON skills 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_interests_updated_at ON interests;
CREATE TRIGGER update_interests_updated_at 
    BEFORE UPDATE ON interests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_fun_facts_updated_at ON fun_facts;
CREATE TRIGGER update_fun_facts_updated_at 
    BEFORE UPDATE ON fun_facts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_certifications_updated_at ON certifications;
CREATE TRIGGER update_certifications_updated_at 
    BEFORE UPDATE ON certifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON courses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_learning_goals_updated_at ON learning_goals;
CREATE TRIGGER update_learning_goals_updated_at 
    BEFORE UPDATE ON learning_goals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_meetings_updated_at ON meetings;
CREATE TRIGGER update_meetings_updated_at 
    BEFORE UPDATE ON meetings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at 
    BEFORE UPDATE ON contacts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_visitor_feedback_updated_at ON visitor_feedback;
CREATE TRIGGER update_visitor_feedback_updated_at 
    BEFORE UPDATE ON visitor_feedback 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCIONES AUXILIARES
-- =====================================================

-- Función para obtener estadísticas del portfolio
CREATE OR REPLACE FUNCTION get_portfolio_stats()
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total_projects', (SELECT COUNT(*) FROM projects),
        'completed_projects', (SELECT COUNT(*) FROM projects WHERE status = 'completed'),
        'featured_projects', (SELECT COUNT(*) FROM projects WHERE featured = true),
        'total_work_experiences', (SELECT COUNT(*) FROM work_experiences),
        'total_education', (SELECT COUNT(*) FROM experiences WHERE type = 'education'),
        'total_certifications', (SELECT COUNT(*) FROM certifications),
        'total_courses', (SELECT COUNT(*) FROM courses),
        'total_skills', (SELECT COUNT(*) FROM skills),
        'total_blog_posts', (SELECT COUNT(*) FROM blog_posts WHERE published = true),
        'total_likes', (SELECT COUNT(*) FROM portfolio_likes),
        'total_visits', (SELECT COUNT(*) FROM visit_stats),
        'total_feedback', (SELECT COUNT(*) FROM visitor_feedback WHERE is_public = true),
        'avg_rating', (SELECT ROUND(AVG(rating), 2) FROM visitor_feedback WHERE is_public = true),
        'total_contacts', (SELECT COUNT(*) FROM contacts),
        'pending_meetings', (SELECT COUNT(*) FROM meetings WHERE status = 'pending')
    ) INTO stats;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para generar slug automático para blog posts
CREATE OR REPLACE FUNCTION generate_blog_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := lower(trim(regexp_replace(NEW.title, '[^a-zA-Z0-9\s]', '', 'g')));
        NEW.slug := regexp_replace(NEW.slug, '\s+', '-', 'g');
        
        -- Asegurar que el slug es único
        WHILE EXISTS (SELECT 1 FROM blog_posts WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)) LOOP
            NEW.slug := NEW.slug || '-' || extract(epoch from now())::int::text;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar slug automático
DROP TRIGGER IF EXISTS generate_blog_slug_trigger ON blog_posts;
CREATE TRIGGER generate_blog_slug_trigger
    BEFORE INSERT OR UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION generate_blog_slug();

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================

COMMENT ON TABLE profiles IS 'Información personal del desarrollador/portfolio';
COMMENT ON TABLE projects IS 'Proyectos desarrollados, con enlaces y tecnologías utilizadas';
COMMENT ON TABLE work_experiences IS 'Historial laboral y experiencias profesionales';
COMMENT ON TABLE experiences IS 'Experiencias generales (educación, cursos, workshops)';
COMMENT ON TABLE skills IS 'Habilidades técnicas categorizadas por tipo y nivel';
COMMENT ON TABLE interests IS 'Intereses personales y hobbies';
COMMENT ON TABLE fun_facts IS 'Datos curiosos y estadísticas personales';
COMMENT ON TABLE certifications IS 'Certificaciones profesionales y credenciales';
COMMENT ON TABLE courses IS 'Cursos online y formación complementaria';
COMMENT ON TABLE learning_goals IS 'Objetivos de aprendizaje y metas profesionales';
COMMENT ON TABLE blog_posts IS 'Posts del blog con sistema de tags y visualizaciones';
COMMENT ON TABLE meetings IS 'Sistema de agendamiento de reuniones y consultas';
COMMENT ON TABLE contacts IS 'Mensajes enviados desde el formulario de contacto';
COMMENT ON TABLE visitor_feedback IS 'Comentarios y valoraciones de los visitantes';
COMMENT ON TABLE portfolio_likes IS 'Sistema de likes con seguimiento en tiempo real';
COMMENT ON TABLE visit_stats IS 'Estadísticas detalladas de visitas para analytics';

-- =====================================================
-- SCRIPT COMPLETADO
-- =====================================================
-- Total de tablas creadas: 16
-- RLS habilitado en todas las tablas
-- Políticas de seguridad configuradas para acceso público de lectura
-- Índices optimizados para consultas frecuentes
-- Triggers para updated_at automático
-- Funciones auxiliares para estadísticas del portfolio
-- Sistema de slug automático para blog posts
-- =====================================================