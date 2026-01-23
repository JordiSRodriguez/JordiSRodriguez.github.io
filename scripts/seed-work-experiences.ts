/**
 * Seed work experiences data
 * Run with: npx tsx scripts/seed-work-experiences.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const workExperiences = [
  {
    title: 'Senior Full Stack Developer',
    company: 'Tech Innovations Inc.',
    position: 'Lead Developer',
    description: 'Liderazgo del desarrollo de aplicaciones web escalables utilizando React, Next.js y Node.js. Implementación de arquitecturas de microservicios y optimización de rendimiento del 40%. Mentoria de equipo de 5 desarrolladores y establecimiento de mejores prácticas de código.',
    location: 'Quito, Ecuador',
    company_url: 'https://techinnovations.example.com',
    logo_url: 'https://techinnovations.example.com/logo.png',
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    start_date: '2022-03-01',
    end_date: null,
    current_job: true,
  },
  {
    title: 'Full Stack Developer',
    company: 'Digital Solutions Ltd.',
    position: 'Mid-level Developer',
    description: 'Desarrollo y mantenimiento de múltiples proyectos web para clientes internacionales. Colaboración con equipos de diseño y producto para crear experiencias de usuario excepcionales. Implementación de CI/CD pipelines y pruebas automatizadas.',
    location: 'Quito, Ecuador',
    company_url: 'https://digitalsolutions.example.com',
    logo_url: 'https://digitalsolutions.example.com/logo.png',
    technologies: ['Vue.js', 'Nuxt.js', 'Python', 'Django', 'PostgreSQL', 'Redis', 'GitHub Actions'],
    start_date: '2020-06-01',
    end_date: '2022-02-28',
    current_job: false,
  },
  {
    title: 'Frontend Developer',
    company: 'Creative Agency',
    position: 'Junior Developer',
    description: 'Desarrollo de interfaces interactivas y animaciones para campañas de marketing digital. Optimización de rendimiento de sitios web y aseguramiento de compatibilidad cross-browser. Colaboración con diseñadores UX/UI.',
    location: 'Quito, Ecuador',
    company_url: 'https://creativeagency.example.com',
    logo_url: 'https://creativeagency.example.com/logo.png',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'SASS', 'GSAP', 'Webpack', 'Git'],
    start_date: '2019-01-15',
    end_date: '2020-05-31',
    current_job: false,
  },
  {
    title: 'Intern Developer',
    company: 'StartUp Hub',
    position: 'Intern',
    description: 'Desarrollo de prototipos y MVPs para startups. Aprendizaje de metodologías ágiles y colaboración en equipos multidisciplinarios. Participación en code reviews y pair programming sessions.',
    location: 'Quito, Ecuador',
    company_url: 'https://startuphub.example.com',
    logo_url: 'https://startuphub.example.com/logo.png',
    technologies: ['React', 'JavaScript', 'CSS3', 'Firebase', 'MongoDB', 'Figma'],
    start_date: '2018-06-01',
    end_date: '2018-12-31',
    current_job: false,
  },
];

async function seedWorkExperiences() {
  console.log('🌱 Seeding work experiences data...\n');

  try {
    // Check existing data
    const { data: existingData, error: checkError } = await supabase
      .from('work_experiences')
      .select('id');

    if (checkError) {
      console.error('❌ Error checking existing data:', checkError);
      throw checkError;
    }

    if (existingData && existingData.length > 0) {
      console.log(`⚠️  Found ${existingData.length} existing work experience(s).`);
      console.log('Please clear the table first or use the Dev Section to manage data.');
      return;
    }

    // Insert work experiences
    console.log(`📝 Inserting ${workExperiences.length} work experience(s)...`);

    const { data, error } = await supabase
      .from('work_experiences')
      .insert(workExperiences)
      .select();

    if (error) {
      console.error('❌ Error inserting data:', error);
      throw error;
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} work experience(s)\n`);

    // Display inserted data
    console.log('📋 Inserted data:\n');
    data?.forEach((exp, index) => {
      console.log(`${index + 1}. ${exp.title} at ${exp.company}`);
      console.log(`   ${exp.location} | ${exp.start_date} - ${exp.end_date || 'Presente'}`);
      console.log(`   ${exp.technologies?.length || 0} technologies\n`);
    });

    console.log('✨ Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedWorkExperiences();
