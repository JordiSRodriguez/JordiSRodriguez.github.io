-- Seed data for work_experiences table
-- This script populates the table with sample professional experience data

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE work_experiences CASCADE;

-- Insert sample work experiences
INSERT INTO work_experiences (title, company, position, description, location, company_url, logo_url, technologies, start_date, end_date, current_job) VALUES
(
    'Senior Full Stack Developer',
    'Tech Innovations Inc.',
    'Lead Developer',
    'Liderazgo del desarrollo de aplicaciones web escalables utilizando React, Next.js y Node.js. Implementación de arquitecturas de microservicios y optimización de rendimiento del 40%. Mentoria de equipo de 5 desarrolladores y establecimiento de mejores prácticas de código.',
    'Quito, Ecuador',
    'https://techinnovations.example.com',
    'https://techinnovations.example.com/logo.png',
    ARRAY['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    '2022-03-01',
    NULL,
    TRUE
),
(
    'Full Stack Developer',
    'Digital Solutions Ltd.',
    'Mid-level Developer',
    'Desarrollo y mantenimiento de múltiples proyectos web para clientes internacionales. Colaboración con equipos de diseño y producto para crear experiencias de usuario excepcionales. Implementación de CI/CD pipelines y pruebas automatizadas.',
    'Quito, Ecuador',
    'https://digitalsolutions.example.com',
    'https://digitalsolutions.example.com/logo.png',
    ARRAY['Vue.js', 'Nuxt.js', 'Python', 'Django', 'PostgreSQL', 'Redis', 'GitHub Actions'],
    '2020-06-01',
    '2022-02-28',
    FALSE
),
(
    'Frontend Developer',
    'Creative Agency',
    'Junior Developer',
    'Desarrollo de interfaces interactivas y animaciones para campañas de marketing digital. Optimización de rendimiento de sitios web y aseguramiento de compatibilidad cross-browser. Colaboración con diseñadores UX/UI.',
    'Quito, Ecuador',
    'https://creativeagency.example.com',
    'https://creativeagency.example.com/logo.png',
    ARRAY['JavaScript', 'HTML5', 'CSS3', 'SASS', 'GSAP', 'Webpack', 'Git'],
    '2019-01-15',
    '2020-05-31',
    FALSE
),
(
    'Intern Developer',
    'StartUp Hub',
    'Intern',
    'Desarrollo de prototipos y MVPs para startups. Aprendizaje de metodologías ágiles y colaboración en equipos multidisciplinarios. Participación en code reviews y pair programming sessions.',
    'Quito, Ecuador',
    'https://startuphub.example.com',
    'https://startuphub.example.com/logo.png',
    ARRAY['React', 'JavaScript', 'CSS3', 'Firebase', 'MongoDB', 'Figma'],
    '2018-06-01',
    '2018-12-31',
    FALSE
);

-- Verify inserted data
SELECT
    title,
    company,
    location,
    start_date,
    end_date,
    current_job,
    array_length(technologies, 1) as tech_count
FROM work_experiences
ORDER BY start_date DESC;
