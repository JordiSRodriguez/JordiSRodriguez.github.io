import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY) {
      return NextResponse.json({ error: "API no configurada" }, { status: 500 });
    }

    // Llamar directamente a Hugging Face desde el servidor
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: context },
          { role: "user", content: message }
        ],
        max_tokens: 200,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      console.error("Hugging Face API error:", response.status, response.statusText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      return NextResponse.json({ error: "Sin respuesta" }, { status: 500 });
    }

    return NextResponse.json({
      response: aiResponse.trim(),
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("AI Proxy Error:", error);
    
    return NextResponse.json({
      response: "Disculpa, hay un problema técnico. Puedes contactar directamente para más información.",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
