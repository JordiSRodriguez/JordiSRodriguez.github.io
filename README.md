# 🚀 Portfolio de Jordi

Un portfolio moderno y dinámico construido con Next.js 14, React Server Components y Supabase.

## ✨ Características

- 🎨 **Diseño Responsivo**: Optimizado para desktop y móvil
- 🌙 **Modo Oscuro**: Tema dark por defecto con next-themes
- 📱 **Mobile First**: Navegación adaptativa con dock flotante
- 🔄 **Tiempo Real**: Likes en tiempo real con Supabase Realtime
- 🛠 **Panel de Admin**: Gestión de datos en desarrollo
- 📊 **Analytics**: Panel de estadísticas (solo desarrollo)
- 🎵 **Componentes Interactivos**: Reproductor de música, clima
- 🤖 **Asistente de IA**: Chat inteligente con OpenAI y Hugging Face

## 🛠 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Real-time**: Supabase Realtime
- **AI**: OpenAI API via Hugging Face Router
- **Icons**: Lucide React
- **Fonts**: Geist Sans/Mono

## 🚀 Instalación

1. **Clonar el repositorio**

   ```bash
   git clone [tu-repo-url]
   cd portfolio-jordi
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env.local
   ```

   Edita `.env.local` con tus credenciales de Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   NEXT_PUBLIC_HUGGINGFACE_API_KEY=tu_token_de_hugging_face
   ```

   > **🤖 Para el Asistente de IA**: Obtén tu token gratuito en [Hugging Face Settings](https://huggingface.co/settings/tokens)

4. **Configurar la base de datos**

   - Ve a [Supabase Dashboard](https://supabase.com/dashboard)
   - Crea un nuevo proyecto
   - Ejecuta el script SQL en `scripts/001_clean_portfolio_schema.sql`

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 📱 Características Móvil vs Desktop

### Desktop

- Sidebar de navegación fijo
- Widgets flotantes (GitHub, Clima)
- Chat AI integrado

### Móvil

- Dock flotante en la parte inferior
- Modales para widgets
- Navegación optimizada para touch

## 🤖 Asistente de IA

El portfolio incluye un asistente de IA avanzado que puede responder preguntas sobre el desarrollador, sus proyectos y habilidades.

### Características del Asistente

- **🧠 IA Inteligente**: Usa OpenAI a través del router de Hugging Face
- **💬 Contexto Específico**: Entrenado con información del portfolio
- **⌨️ Atajos**: Usa `Ctrl+I` para abrir/cerrar el chat
- **📱 Responsive**: Interfaz adaptada para móvil y desktop
- **⚡ Tiempo Real**: Respuestas rápidas y contextualmente relevantes

### Ejemplo de Uso

Puedes preguntarle cosas como:

- "¿Qué tecnologías domina Jordi?"
- "Cuéntame sobre sus proyectos más interesantes"
- "¿Cómo puedo contactar con él?"
- "¿Qué experiencia tiene en React?"

### Configuración del Asistente

1. Obtén un token gratuito de [Hugging Face](https://huggingface.co/settings/tokens)
2. Agrega el token a tu `.env.local`:
   ```env
   NEXT_PUBLIC_HUGGINGFACE_API_KEY=tu_token_aqui
   ```
3. El asistente estará disponible automáticamente en el portfolio

> **📚 Documentación completa**: Ver `docs/AI_ASSISTANT.md` para más detalles técnicos.

## 🔧 Panel de Administración

En modo desarrollo, tendrás acceso a:

- **📊 Analytics**: Estadísticas del portfolio
- **🗃 Data Management**: CRUD completo para todas las tablas
  - Profiles, Projects, Work Experiences
  - Skills, Education, Contacts
  - Visitor Feedback, Visit Stats

> ⚠️ **Nota**: Estas secciones solo son visibles en `NODE_ENV=development`

## 🗄 Estructura de la Base de Datos

```sql
-- Tablas principales
├── profiles          # Información personal
├── projects          # Proyectos del portfolio
├── work_experiences  # Experiencia laboral
├── skills           # Habilidades y tecnologías
├── education        # Formación académica
├── contacts         # Mensajes de contacto
├── visitor_feedback # Feedback de visitantes
├── portfolio_likes  # Sistema de likes (tiempo real)
└── visit_stats      # Estadísticas de visitas
```

## 🔒 Seguridad

- ✅ **Variables de entorno** protegidas en `.gitignore`
- ✅ **RLS (Row Level Security)** habilitado en Supabase
- ✅ **Políticas públicas** solo para lectura
- ✅ **Herramientas de admin** solo en desarrollo
- ✅ **Claves API** nunca expuestas en el código

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conectar con GitHub**

   - Sube tu código a GitHub
   - Ve a [Vercel Dashboard](https://vercel.com)
   - Importa tu repositorio

2. **Configurar variables de entorno**

   - En Vercel Dashboard > Settings > Environment Variables
   - Agrega las mismas variables de tu `.env.local`

3. **Deploy automático**
   - Cada push a main desplegará automáticamente

### Otras plataformas

El proyecto es compatible con cualquier plataforma que soporte Next.js:

- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 📁 Estructura del Proyecto

```
├── app/                  # Next.js App Router
├── components/           # Componentes React
│   ├── sections/         # Secciones del portfolio
│   └── ui/              # Componentes shadcn/ui
├── contexts/            # React Contexts
├── hooks/               # Custom hooks
├── lib/                 # Utilidades y configuración
│   └── supabase/        # Cliente de Supabase
├── scripts/             # Scripts SQL
├── public/              # Archivos estáticos
└── styles/              # Estilos globales
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👤 Autor

**Jordi** - [Tu GitHub](https://github.com/tu-usuario)

---

⭐ ¡Dale una estrella si te ha gustado el proyecto!
