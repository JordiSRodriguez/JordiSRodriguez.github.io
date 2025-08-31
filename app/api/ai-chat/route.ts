import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createClient } from "@supabase/supabase-js";

// Cliente de Supabase para obtener datos dinámicos
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Función para obtener contexto dinámico desde la base de datos
async function getDynamicContext() {
  try {
    // Obtener información del perfil
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .single();

    // Obtener proyectos destacados
    const { data: projects } = await supabase
      .from("projects")
      .select("title, description, technologies, featured")
      .eq("featured", true)
      .limit(5);

    // Obtener experiencias laborales
    const { data: workExperiences } = await supabase
      .from("work_experiences")
      .select("title, company, position, technologies, current_job")
      .order("start_date", { ascending: false })
      .limit(3);

    // Obtener habilidades por categoría
    const { data: skills } = await supabase
      .from("skills")
      .select("name, category, level")
      .gte("level", 3)
      .order("level", { ascending: false });

    return {
      profile: profile || {},
      projects: projects || [],
      workExperiences: workExperiences || [],
      skills: skills || [],
    };
  } catch (error) {
    console.error("Error al obtener contexto dinámico:", error);
    return null;
  }
}

// Función para construir el contexto basado en datos reales
function buildContextFromData(data: any) {
  const { profile, projects, workExperiences, skills } = data;

  // Agrupar habilidades por categoría
  const skillsByCategory = skills.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {});

  const context = `
Eres un asistente conciso para el portfolio de ${profile.full_name || "Jordi"}.

PERFIL:
${
  profile.bio
    ? `• ${profile.bio}`
    : "• Desarrollador Full-Stack especializado en tecnologías modernas"
}
${profile.location ? `• Ubicación: ${profile.location}` : ""}
${profile.roles ? `• Roles: ${profile.roles.join(", ")}` : ""}

TECNOLOGÍAS PRINCIPALES:
${Object.entries(skillsByCategory)
  .map(
    ([category, skillList]: [string, any]) =>
      `• ${category}: ${skillList.slice(0, 5).join(", ")}`
  )
  .join("\n")}

EXPERIENCIA RECIENTE:
${workExperiences
  .map(
    (exp: any) =>
      `• ${exp.position || exp.title} en ${exp.company}${
        exp.current_job ? " (Actual)" : ""
      }`
  )
  .join("\n")}

PROYECTOS DESTACADOS:
${projects
  .map(
    (project: any) =>
      `• ${project.title}: ${project.description.slice(0, 100)}...`
  )
  .join("\n")}

CONTACTO:
${profile.github_username ? `• GitHub: ${profile.github_username}` : ""}
${profile.linkedin_url ? `• LinkedIn: Disponible en el portfolio` : ""}
${profile.website_url ? `• Website: ${profile.website_url}` : ""}

REGLAS:
• Respuestas maximo 2-3 parrafos cortos
• IMPORTANTE: Sin formateo markdown (**, ##, etc.) - solo texto plano
• Sin caracteres especiales - usa: a, e, i, o, u (sin acentos)
• ENFOQUE: Responde solo preguntas relacionadas con el portfolio, experiencia profesional, proyectos, tecnologias o carrera de ${
    profile.full_name || "Jordi"
  }
• Si la pregunta NO esta relacionada con el portfolio, responde: "Lo siento, estoy aqui para ayudarte con informacion sobre el portfolio, proyectos y experiencia profesional. ¿Hay algo especifico sobre mi trabajo que te gustaria saber?"
• Para mas detalles: "Contacta directamente para mas informacion"
• Tono profesional y directo
• Respuesta completa sin cortes
`;

  return context;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY) {
      return NextResponse.json(
        { error: "Token de Hugging Face no configurado" },
        { status: 500 }
      );
    }

    // Obtener contexto dinámico desde la base de datos
    const dynamicData = await getDynamicContext();

    // Usar contexto dinámico o fallback estático
    const portfolioContext = dynamicData
      ? buildContextFromData(dynamicData)
      : `
Eres un asistente conciso para el portfolio de Jordi (desarrollador Full-Stack).
• Frontend: React, Next.js 14+, TypeScript, Tailwind CSS
• Backend: Node.js, Python, Express, FastAPI
• Bases de datos: PostgreSQL, Supabase, MongoDB
• Cloud: Vercel, AWS, GitHub Actions
REGLAS: 
• Sin formateo markdown, respuestas directas máximo 2-3 párrafos
• SOLO responde preguntas sobre portfolio, proyectos, tecnologias y experiencia profesional
• Si la pregunta no esta relacionada, responde: "Lo siento, estoy aqui para ayudarte con informacion sobre el portfolio, proyectos y experiencia profesional. ¿Hay algo especifico sobre mi trabajo que te gustaria saber?"
`;

    // Inicializar el cliente OpenAI solo cuando se necesite
    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY,
    });

    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "system",
          content: portfolioContext,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 200,
      temperature: 0.2,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: "No se pudo generar respuesta" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error en AI Chat API:", error);

    // Respuesta de fallback en caso de error
    const fallbackResponse =
      "Lo siento, estoy experimentando dificultades técnicas en este momento. Por favor, intenta de nuevo en unos momentos o usa el formulario de contacto para comunicarte directamente.";

    return NextResponse.json(
      {
        response: fallbackResponse,
        error: "Error interno del servidor",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
