import { createClient } from '@supabase/supabase-js'

// Mock Supabase client for testing
export const createMockSupabaseClient = () => {
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (field: string, value: any) => ({
          single: () => Promise.resolve({ data: mockData[table], error: null }),
          limit: (n: number) => Promise.resolve({ data: mockData[table]?.slice(0, n), error: null }),
        }),
        order: (field: string, options: any) => ({
          limit: (n?: number) => Promise.resolve({ data: mockData[table], error: null }),
        }),
        gte: (field: string, value: any) => ({
          order: (f: string, o: any) => ({
            limit: (n?: number) => Promise.resolve({ data: mockData[table], error: null }),
          }),
        }),
        limit: (n: number) => Promise.resolve({ data: mockData[table], error: null }),
        single: () => Promise.resolve({ data: mockData[table]?.[0], error: null }),
      }),
    }),
    channel: (name: string) => ({
      on: (event: string, config: any, callback: any) => ({
        subscribe: () => ({ subscription: { unsubscribe: () => {} } }),
      }),
    }),
    removeChannel: () => {},
  } as any
}

// Mock data
const mockData: Record<string, any> = {
  profiles: [
    {
      id: 1,
      full_name: 'Jordi Sumba',
      bio: 'Full Stack Developer',
      location: 'Spain',
    },
  ],
  projects: [
    {
      id: 1,
      title: 'Portfolio',
      description: 'Personal portfolio',
      technologies: ['React', 'Next.js'],
    },
  ],
  skills: [
    { id: 1, name: 'React', level: 90, category: 'Frontend' },
    { id: 2, name: 'TypeScript', level: 85, category: 'Languages' },
  ],
  work_experiences: [
    {
      id: 1,
      title: 'Senior Developer',
      company: 'Tech Corp',
      position: 'Senior',
    },
  ],
}
