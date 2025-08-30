// pages/api/populate-db.js
// Endpoint para poblar la base de datos con datos de prueba

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("🚀 Iniciando población de la base de datos...");

    // 1. Insertar proyectos
    const { error: projectsError } = await supabase.from("projects").upsert(
      [
        {
          title: "E-commerce Platform",
          description: "Full-stack e-commerce solution with React and Node.js",
          technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
          status: "completed",
        },
        {
          title: "Portfolio Website",
          description: "Personal portfolio built with Next.js and Tailwind CSS",
          technologies: ["Next.js", "Tailwind CSS", "TypeScript", "Supabase"],
          status: "completed",
        },
        {
          title: "Task Management App",
          description: "Collaborative task management application",
          technologies: ["Vue.js", "Express.js", "MongoDB", "Socket.io"],
          status: "completed",
        },
        {
          title: "Mobile App",
          description: "Cross-platform mobile application with React Native",
          technologies: ["React Native", "Expo", "Firebase"],
          status: "in-progress",
        },
        {
          title: "Data Dashboard",
          description: "Analytics dashboard for business intelligence",
          technologies: ["React", "D3.js", "Python", "FastAPI"],
          status: "completed",
        },
        {
          title: "Blog CMS",
          description: "Content management system for blogging",
          technologies: ["Nuxt.js", "Strapi", "MySQL"],
          status: "completed",
        },
        {
          title: "Weather App",
          description: "Real-time weather application",
          technologies: ["React", "OpenWeather API", "Chart.js"],
          status: "completed",
        },
      ],
      { onConflict: "id" }
    );

    // 2. Insertar experiencias laborales
    const { error: workError } = await supabase.from("work_experiences").upsert(
      [
        {
          title: "Senior Full Stack Developer",
          company: "TechCorp Solutions",
          location: "Madrid, Spain",
          start_date: "2023-01-01",
          description:
            "Leading development of enterprise web applications using modern technologies.",
          technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
        },
        {
          title: "Full Stack Developer",
          company: "StartupXYZ",
          location: "Barcelona, Spain",
          start_date: "2021-06-01",
          end_date: "2022-12-31",
          description:
            "Developed and maintained multiple web applications for startup clients.",
          technologies: ["Vue.js", "Express.js", "MongoDB", "Docker"],
        },
        {
          title: "Frontend Developer",
          company: "Digital Agency",
          location: "Valencia, Spain",
          start_date: "2020-01-01",
          end_date: "2021-05-31",
          description:
            "Created responsive websites and web applications for various clients.",
          technologies: ["React", "JavaScript", "CSS3", "Webpack"],
        },
        {
          title: "Junior Developer",
          company: "Web Solutions Inc",
          location: "Sevilla, Spain",
          start_date: "2019-03-01",
          end_date: "2019-12-31",
          description:
            "Started career developing small to medium web projects.",
          technologies: ["HTML", "CSS", "JavaScript", "PHP"],
        },
      ],
      { onConflict: "id" }
    );

    // 3. Insertar posts de blog
    const { error: blogError } = await supabase.from("blog_posts").upsert(
      [
        {
          title: "Getting Started with Next.js",
          excerpt: "A comprehensive guide to building modern web applications",
          content: "Lorem ipsum dolor sit amet...",
          published: true,
          tags: ["Next.js", "React", "JavaScript"],
        },
        {
          title: "The Future of Web Development",
          excerpt: "Exploring upcoming trends in web development",
          content: "Lorem ipsum dolor sit amet...",
          published: true,
          tags: ["Web Development", "Trends", "Technology"],
        },
        {
          title: "Building Scalable APIs",
          excerpt: "Best practices for creating robust backend services",
          content: "Lorem ipsum dolor sit amet...",
          published: true,
          tags: ["API", "Node.js", "Backend"],
        },
        {
          title: "CSS Grid vs Flexbox",
          excerpt: "When to use CSS Grid and when to use Flexbox",
          content: "Lorem ipsum dolor sit amet...",
          published: false,
          tags: ["CSS", "Layout", "Frontend"],
        },
        {
          title: "Introduction to TypeScript",
          excerpt: "Why TypeScript is changing the game",
          content: "Lorem ipsum dolor sit amet...",
          published: true,
          tags: ["TypeScript", "JavaScript", "Development"],
        },
      ],
      { onConflict: "id" }
    );

    // 4. Crear tabla contacts si no existe e insertar datos
    const { error: contactsError } = await supabase
      .from("contacts")
      .upsert(
        [
          {
            name: "John Doe",
            email: "john@example.com",
            subject: "Project Inquiry",
            message:
              "Hi, I would like to discuss a potential project collaboration.",
            status: "new",
          },
          {
            name: "Jane Smith",
            email: "jane@example.com",
            subject: "Job Opportunity",
            message:
              "We have an exciting job opportunity that might interest you.",
            status: "read",
          },
          {
            name: "Mike Johnson",
            email: "mike@example.com",
            subject: "Freelance Work",
            message: "Looking for a developer for a short-term project.",
            status: "replied",
          },
          {
            name: "Sarah Wilson",
            email: "sarah@example.com",
            subject: "Collaboration",
            message: "Interested in collaborating on an open source project.",
            status: "new",
          },
          {
            name: "David Brown",
            email: "david@example.com",
            subject: "Technical Question",
            message: "I have a question about one of your blog posts.",
            status: "read",
          },
        ],
        { onConflict: "id" }
      )
      .select()
      .then((result) => {
        if (result.error && result.error.code === "42P01") {
          // La tabla no existe, intentar crearla
          return supabase.rpc("create_contacts_table_if_not_exists");
        }
        return result;
      });

    // 5. Insertar skills
    const { error: skillsError } = await supabase.from("skills").upsert(
      [
        {
          name: "JavaScript",
          level: 5,
          color: "text-yellow-500",
          category: "Programming",
          icon: "Code2",
          display_order: 1,
        },
        {
          name: "TypeScript",
          level: 5,
          color: "text-blue-600",
          category: "Programming",
          icon: "Code",
          display_order: 2,
        },
        {
          name: "React",
          level: 5,
          color: "text-cyan-500",
          category: "Frontend",
          icon: "Code",
          display_order: 3,
        },
        {
          name: "Next.js",
          level: 4,
          color: "text-gray-800",
          category: "Frontend",
          icon: "Code",
          display_order: 4,
        },
        {
          name: "Node.js",
          level: 4,
          color: "text-green-600",
          category: "Backend",
          icon: "Terminal",
          display_order: 5,
        },
        {
          name: "Python",
          level: 4,
          color: "text-blue-500",
          category: "Programming",
          icon: "Code",
          display_order: 6,
        },
        {
          name: "PostgreSQL",
          level: 4,
          color: "text-blue-700",
          category: "Database",
          icon: "Database",
          display_order: 7,
        },
        {
          name: "MongoDB",
          level: 3,
          color: "text-green-500",
          category: "Database",
          icon: "Database",
          display_order: 8,
        },
        {
          name: "Docker",
          level: 3,
          color: "text-blue-400",
          category: "DevOps",
          icon: "Container",
          display_order: 9,
        },
        {
          name: "AWS",
          level: 3,
          color: "text-orange-500",
          category: "Cloud",
          icon: "Cloud",
          display_order: 10,
        },
        {
          name: "Git",
          level: 5,
          color: "text-red-500",
          category: "Tools",
          icon: "GitBranch",
          display_order: 11,
        },
        {
          name: "Tailwind CSS",
          level: 5,
          color: "text-teal-500",
          category: "Frontend",
          icon: "Palette",
          display_order: 12,
        },
        {
          name: "Vue.js",
          level: 3,
          color: "text-green-500",
          category: "Frontend",
          icon: "Code",
          display_order: 13,
        },
        {
          name: "Express.js",
          level: 4,
          color: "text-gray-600",
          category: "Backend",
          icon: "Terminal",
          display_order: 14,
        },
        {
          name: "GraphQL",
          level: 3,
          color: "text-pink-500",
          category: "Backend",
          icon: "Globe",
          display_order: 15,
        },
      ],
      { onConflict: "id" }
    );

    const errors = [
      projectsError,
      workError,
      blogError,
      contactsError,
      skillsError,
    ].filter(Boolean);

    res.status(200).json({
      success: true,
      message: "¡Base de datos poblada con éxito!",
      warnings: errors.length > 0 ? errors.map((e) => e.message) : null,
      data: {
        projects: "7 proyectos insertados",
        workExperiences: "4 experiencias laborales insertadas",
        blogPosts: "5 posts insertados",
        contacts: "5 contactos insertados",
        skills: "15 skills insertadas",
      },
    });
  } catch (error) {
    console.error("Error poblando la base de datos:", error);
    res.status(500).json({
      success: false,
      message: "Error poblando la base de datos",
      error: error.message,
    });
  }
}
