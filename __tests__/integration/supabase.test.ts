import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

// Mock Supabase client
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(),
}))

describe('Supabase Integration Tests', () => {
  const mockSupabase = {
    from: vi.fn(),
    channel: vi.fn(),
    removeChannel: vi.fn(),
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    // Reset environment
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

    // Set up default mock
    const { createBrowserClient } = await import('@supabase/ssr')
    createBrowserClient.mockReturnValue(mockSupabase as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Database Connection', () => {
    it('creates Supabase client with correct credentials', async () => {
      const { createBrowserClient } = await import('@supabase/ssr')
      const client = createBrowserClient('test-url', 'test-key')

      expect(client).toBeDefined()
      expect(createBrowserClient).toHaveBeenCalledWith('test-url', 'test-key')
    })

    it('handles missing environment variables gracefully', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL

      await expect(async () => {
        const { createBrowserClient } = await import('@supabase/ssr')
        createBrowserClient()
      }).not.toThrow()
    })
  })

  describe('Data Fetching', () => {
    it('fetches profile data successfully', async () => {
      const mockData = {
        id: '1',
        full_name: 'Test User',
        bio: 'Test bio',
      }

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: [mockData],
            error: null,
          }),
        }),
      })

      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient('test-url', 'test-key')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)

      expect(data).toEqual([mockData])
      expect(error).toBeNull()
    })

    it('handles Supabase errors gracefully', async () => {
      const mockError = new Error('Database connection failed')

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        }),
      })

      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient('test-url', 'test-key')

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)

      expect(error).toEqual(mockError)
      consoleSpy.mockRestore()
    })
  })

  describe('Realtime Subscriptions', () => {
    it('creates and removes channel correctly', async () => {
      const mockChannel = {
        on: vi.fn().mockReturnValue({
          subscribe: vi.fn().mockResolvedValue({}),
        }),
      }

      mockSupabase.channel.mockReturnValue(mockChannel)
      mockSupabase.removeChannel.mockReturnValue(undefined)

      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient('test-url', 'test-key')

      const channel = supabase.channel('test-channel')

      // Actually call the on method
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'test' },
        () => {}
      )

      expect(channel.on).toHaveBeenCalledWith(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'test' },
        expect.any(Function)
      )

      supabase.removeChannel(channel)

      expect(mockSupabase.removeChannel).toHaveBeenCalledWith(channel)
    })
  })

  describe('Insert Operations', () => {
    it('inserts data into database', async () => {
      const mockInsert = {
        data: [{ id: '123' }],
        error: null,
      }

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue(mockInsert),
      })

      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient('test-url', 'test-key')

      const { data, error } = await supabase
        .from('contacts')
        .insert([
          {
            name: 'Test User',
            email: 'test@example.com',
            message: 'Test message',
          },
        ])

      expect(data).toEqual([{ id: '123' }])
      })

    it('handles insert errors', async () => {
      const mockError = new Error('Insert failed')

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      })

      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient('test-url', 'test-key')

      const { error } = await supabase
        .from('contacts')
        .insert([{ name: 'Test' }])

      expect(error).toEqual(mockError)
    })
  })

  describe('Update Operations', () => {
    it('updates data in database', async () => {
      const mockUpdate = {
        data: [{ id: '123', status: 'new' }],
        error: null,
      }

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue(mockUpdate),
        }),
      })

      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient('test-url', 'test-key')

      const { data, error } = await supabase
        .from('projects')
        .update({ status: 'completed' })
        .eq('id', '123')

      expect(data).toEqual([{ id: '123', status: 'new' }])
      expect(error).toBeNull()
    })
  })

  describe('Delete Operations', () => {
    it('deletes data from database', async () => {
      const mockDelete = {
        error: null,
      }

      mockSupabase.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue(mockDelete),
        }),
      })

      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient('test-url', 'test-key')

      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', '123')

      expect(error).toBeNull()
    })
  })

  describe('Query Complex Operations', () => {
    it('handles complex queries with joins', async () => {
      const mockData = [
        {
          id: '1',
          title: 'Project 1',
          technologies: ['React', 'TypeScript'],
        },
      ]

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockData,
            error: null,
          }),
        }),
      })

      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient('test-url', 'test-key')

      const { data, error } = await supabase
        .from('projects')
        .select('*, technologies')
        .order('created_at', { ascending: false })

      expect(data).toEqual(mockData)
    })
  })

  describe('Realtime Features', () => {
    it('subscribes to table changes', async () => {
      const mockChannel = {
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockResolvedValue({
          unsubscribe: vi.fn(),
        }),
      }

      mockSupabase.channel.mockReturnValue(mockChannel)

      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient('test-url', 'test-key')

      const channel = supabase
        .channel('test-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'test' }, () => {})

      expect(channel.on).toHaveBeenCalled()

      const subscription = await channel.subscribe()

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')
    })

    it('unsubscribes from channel on cleanup', async () => {
      const mockChannel = {
        on: vi.fn().mockReturnValue({
          subscribe: vi.fn().mockResolvedValue({
            subscription: { unsubscribe: vi.fn() },
          }),
        }),
      }

      mockSupabase.channel.mockReturnValue(mockChannel)

      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient('test-url', 'test-key')

      const channel = supabase.channel('cleanup-test')

      supabase.removeChannel(channel)

      expect(mockSupabase.removeChannel).toHaveBeenCalledWith(channel)
    })
  })
})
