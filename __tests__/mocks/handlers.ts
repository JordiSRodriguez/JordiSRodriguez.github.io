import { http, HttpResponse } from 'msw'

// Mock Supabase responses
export const handlers = [
  // Mock profile fetch
  http.get('https://*.supabase.co/rest/v1/profiles', () => {
    return HttpResponse.json([
      {
        id: 1,
        full_name: 'Jordi Sumba',
        bio: 'Full Stack Developer specializing in React and Next.js',
        location: 'Spain',
        avatar_url: null,
      },
    ])
  }),

  // Mock projects fetch
  http.get('https://*.supabase.co/rest/v1/projects', () => {
    return HttpResponse.json([
      {
        id: 1,
        title: 'Portfolio Website',
        description: 'Personal portfolio built with Next.js',
        technologies: ['Next.js', 'React', 'TypeScript'],
        featured: true,
      },
      {
        id: 2,
        title: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution',
        technologies: ['Next.js', 'Supabase', 'Stripe'],
        featured: true,
      },
    ])
  }),

  // Mock skills fetch
  http.get('https://*.supabase.co/rest/v1/skills', () => {
    return HttpResponse.json([
      { id: 1, name: 'React', level: 90, category: 'Frontend' },
      { id: 2, name: 'TypeScript', level: 85, category: 'Languages' },
      { id: 3, name: 'Next.js', level: 88, category: 'Frontend' },
    ])
  }),

  // Mock work experiences fetch
  http.get('https://*.supabase.co/rest/v1/work_experiences', () => {
    return HttpResponse.json([
      {
        id: 1,
        title: 'Senior Full Stack Developer',
        company: 'Tech Company',
        position: 'Senior',
        current_job: true,
        start_date: '2023-01-01',
      },
    ])
  }),

  // Mock portfolio likes realtime subscription
  http.get('https://*.supabase.co/rest/v1/portfolio_likes', () => {
    return HttpResponse.json([{ count: 42 }])
  }),
]
