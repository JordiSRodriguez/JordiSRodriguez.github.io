# GitHub Copilot Instructions for Jordi's Portfolio

## Project Architecture

This is a **Next.js 14+ portfolio application** with React Server Components (RSC), using the App Router pattern. The project follows a dual-rendering strategy:

- **Desktop**: Traditional sidebar navigation with floating widgets (`FloatingGitHub`, `FloatingWeather`)
- **Mobile**: Collapsible floating dock (`MobileFloatingDock`) with modal overlays (`MobileModals`)

## Key Technologies & Patterns

### Component Architecture

- **shadcn/ui**: All UI components in `components/ui/` follow shadcn patterns with Radix UI primitives
- **Client vs Server**: Most interactive components use `"use client"` directive (floating widgets, navigation, forms)
- **Mobile-first responsive**: Use `useIsMobile()` hook (768px breakpoint) for conditional rendering
- **Context providers**: Navigation state (`NavigationContext`) and floating components state (`FloatingComponentsContext`)

### Database Integration

- **Supabase**: PostgreSQL database for portfolio data (mostly public read access)
- **Client creation**: Always use `createBrowserClient()` from `@supabase/ssr` in components
- **Realtime**: Portfolio likes use Supabase realtime subscriptions (see `StatsSection`)
- **Schema**: Single clean migration file `clean_portfolio_schema.sql` replaces all numbered migrations
- **Security**: Simple RLS policies - public read access, restricted writes for essential data protection

### Styling Conventions

- **Utility function**: Use `cn()` from `@/lib/utils` for conditional classes (combines `clsx` + `tailwind-merge`)
- **Theme**: Dark theme by default with `next-themes` provider in root layout
- **Typography**: Geist Sans/Mono fonts loaded in layout
- **Icons**: Lucide React for all icons

## Development Workflows

### Component Creation

1. Interactive components: Start with `"use client"` directive
2. Mobile variants: Check `useIsMobile()` and create separate mobile/desktop branches
3. Floating components: Register in `FloatingComponentsContext` for state management
4. UI components: Follow shadcn structure with proper Radix UI forwarding

### Database Changes

1. Use the single `clean_portfolio_schema.sql` for fresh setups
2. For modifications, create incremental migration files only when needed
3. Focus on essential tables: `profiles`, `projects`, `work_experiences`, `skills`, `education`, `portfolio_likes`, `contacts`, `visitor_feedback`, `visit_stats`
4. Add corresponding TypeScript types for data structures
5. Test with Supabase realtime if needed (currently used for portfolio likes)

### Build & Deploy

- **Development**: `npm run dev` (uses Turbopack)
- **Build**: ESLint and TypeScript errors are ignored in build (`next.config.mjs`)
- **Images**: Unoptimized for static export compatibility

## Critical Patterns

### Mobile Navigation

Desktop uses `SidebarNavigation`, mobile uses `MobileFloatingDock` + `MobileModals`. Toggle logic in main `page.tsx`:

```tsx
const handleAiChatToggle = () => {
  if (isMobile) {
    setShowMobileAiChat(true); // Modal overlay
  } else {
    // Desktop floating widget logic
  }
};
```

### Section Navigation

All sections register with `NavigationContext`. Use `navigateToSection()` for programmatic navigation and smooth scrolling.

### Supabase Integration

Always create client in component scope, not globally:

```tsx
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

## File Organization

- `/components/sections/`: Main page sections (about, work experience, education)
- `/components/ui/`: shadcn/ui components (auto-generated, don't modify manually)
- `/contexts/`: React contexts for global state
- `/scripts/clean_portfolio_schema.sql`: Single migration file for clean database setup
- `/hooks/`: Custom React hooks (`use-mobile`, `use-toast`)

## Environment Variables Required

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## Common Issues

- **Hydration errors**: Ensure mobile/desktop rendering consistency with `useIsMobile()` properly handling undefined state
- **Supabase realtime**: Always cleanup subscriptions in `useEffect` cleanup
- **Build errors**: TypeScript/ESLint errors are ignored in production builds but should be fixed in development
