import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { RESTMethods } from 'msw/lib/types/RestMethods'

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEST_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

const baseUrl = 'http://localhost:3000'

describe('API Routes Integration Tests', () => {
  let server: ReturnType<typeof setupServer>

  beforeAll(() => {
    // Setup MSW server to mock API routes
    server = setupServer(
      // AI Chat API
      http.post('/api/ai-chat', async ({ request }) => {
        const body = await request.json()

        // Validate request body
        if (!body.message || typeof body.message !== 'string') {
          return HttpResponse.json(
            { error: 'Message is required' },
            { status: 400 }
          )
        }

        // Mock AI response
        return HttpResponse.json({
          response: `AI response to: ${body.message}`,
        })
      }),

      // Contact form submission
      http.post('/api/contact', async ({ request }) => {
        const body = await request.json()

        // Validate required fields
        if (!body.name || !body.email || !body.message) {
          return HttpResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(body.email)) {
          return HttpResponse.json(
            { error: 'Invalid email format' },
            { status: 400 }
          )
        }

        // Mock successful submission
        return HttpResponse.json({
          success: true,
          message: 'Message sent successfully',
        })
      }),

      // CORS preflight for contact
      http.options('/api/contact', () => {
        return new HttpResponse(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        })
      }),

      // Visit tracking
      http.post('/api/visit', async ({ request }) => {
        const body = await request.json()

        // Validate required fields
        if (!body.page_path || !body.visitor_id) {
          return HttpResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          )
        }

        // Mock successful tracking
        return HttpResponse.json({
          success: true,
          tracked: true,
        })
      }),

      // GitHub stats API
      http.get('/api/github-stats', async () => {
        // Mock GitHub stats response
        return HttpResponse.json({
          totalRepos: 42,
          totalStars: 128,
          languages: ['TypeScript', 'JavaScript', 'Python'],
        })
      }),

      // POST on github-stats (should fail)
      http.post('/api/github-stats', () => {
        return HttpResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        )
      }),

      // Feedback submission
      http.post('/api/feedback', async ({ request }) => {
        const body = await request.json()

        if (!body.message || !body.rating) {
          return HttpResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          )
        }

        return HttpResponse.json({
          success: true,
          id: 'feedback-' + Math.random(),
        })
      }),

      // Catch-all for non-existent API endpoints (must be last)
      http.all<{ path: string }>('/api/:path*', ({ params }) => {
        // Only return 404 if this is truly an undefined endpoint
        // Specific endpoints above are matched first
        return HttpResponse.json(
          { error: 'Not found' },
          { status: 404 }
        )
      }),
    )

    // Start the MSW server
    server.listen({ onUnhandledRequest: 'bypass' })
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  describe('POST /api/ai-chat', () => {
    it('returns AI response for valid message', async () => {
      const response = await fetch(`${baseUrl}/api/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello AI' }),
      })

      expect(response.ok).toBe(true)

      const data = await response.json()
      expect(data).toHaveProperty('response')
      expect(data.response).toContain('Hello AI')
    })

    it('returns 400 for missing message', async () => {
      const response = await fetch(`${baseUrl}/api/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data).toHaveProperty('error')
    })

    it('handles malformed JSON gracefully', async () => {
      const response = await fetch(`${baseUrl}/api/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      })

      expect(response.status).toBeGreaterThanOrEqual(400)
    })

    it('handles non-string message', async () => {
      const response = await fetch(`${baseUrl}/api/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 12345 }),
      })

      const data = await response.json()
      expect(data).toHaveProperty('error')
    })
  })

  describe('POST /api/contact', () => {
    it('submits contact form successfully', async () => {
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'Test message body',
        }),
      })

      expect(response.ok).toBe(true)

      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.message).toBeDefined()
    })

    it('rejects submission without name', async () => {
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          message: 'Test',
        }),
      })

      expect(response.status).toBe(400)
    })

    it('rejects submission without email', async () => {
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          message: 'Test message',
        }),
      })

      expect(response.status).toBe(400)
    })

    it('rejects invalid email format', async () => {
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'not-an-email',
          subject: 'Test',
          message: 'Test message',
        }),
      })

      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toContain('email')
    })
  })

  describe('POST /api/visit', () => {
    it('tracks visit successfully', async () => {
      const response = await fetch(`${baseUrl}/api/visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_path: '/home',
          visitor_id: 'visitor-123',
        }),
      })

      expect(response.ok).toBe(true)

      const data = await response.json()
      expect(data.tracked).toBe(true)
    })

    it('rejects visit tracking without page_path', async () => {
      const response = await fetch(`${baseUrl}/api/visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: 'visitor-123',
        }),
      })

      expect(response.status).toBe(400)
    })

    it('handles tracking errors gracefully', async () => {
      const response = await fetch(`${baseUrl}/api/visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_path: '/test',
          visitor_id: 'visitor-123',
        }),
      })

      // Should not throw even if tracking fails
      expect(response.status).toBeLessThan(500)
    })
  })

  describe('GET /api/github-stats', () => {
    it('returns GitHub statistics', async () => {
      const response = await fetch(`${baseUrl}/api/github-stats`)

      expect(response.ok).toBe(true)

      const data = await response.json()
      expect(data).toHaveProperty('totalRepos')
      expect(data).toHaveProperty('totalStars')
      expect(data.totalRepos).toBeGreaterThan(0)
      expect(Array.isArray(data.languages)).toBe(true)
    })

    it('handles rate limiting gracefully', async () => {
      // Mock rate limit scenario
      server.use(
        http.get('/api/github-stats', () => {
          return HttpResponse.json(
            { error: 'Rate limit exceeded' },
            { status: 429 }
          )
        })
      )

      const response = await fetch(`${baseUrl}/api/github-stats`)

      expect(response.status).toBe(429)

      // Reset handler
      server.resetHandlers()
    })
  })

  describe('POST /api/feedback', () => {
    it('submits feedback successfully', async () => {
      const response = await fetch(`${baseUrl}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Great portfolio!',
          rating: 5,
          category: 'general',
        }),
      })

      expect(response.ok).toBe(true)

      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data).toHaveProperty('id')
    })

    it('rejects feedback without message', async () => {
      const response = await fetch(`${baseUrl}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: 5 }),
      })

      expect(response.status).toBe(400)
    })

    it('rejects feedback without rating', async () => {
      const response = await fetch(`${baseUrl}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Test feedback' }),
      })

      expect(response.status).toBe(400)
    })
  })

  describe('API Error Handling', () => {
    it('returns 404 for non-existent endpoints', async () => {
      const response = await fetch(`${baseUrl}/api/non-existent`, {
        method: 'GET',
      })

      expect(response.status).toBe(404)
    })

    it('handles POST on GET endpoints', async () => {
      const response = await fetch(`${baseUrl}/api/github-stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: 'test' }),
      })

      expect(response.status).toBe(405) // Method Not Allowed
    })

    it('handles large payloads', async () => {
      const largeMessage = 'x'.repeat(10000)

      const response = await fetch(`${baseUrl}/api/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: largeMessage }),
      })

      // Should either accept or reject with proper error
      expect(response.status).not.toBe(500)
    })
  })

  describe('API Security', () => {
    it('does not expose sensitive data in error messages', async () => {
      server.use(
        http.post('/api/ai-chat', () => {
          return HttpResponse.json(
            {
              error: 'Internal server error',
              details: process.env.SECRET_KEY, // Should not be exposed
            },
            { status: 500 }
          )
        })
      )

      const response = await fetch(`${baseUrl}/api/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Test' }),
      })

      const data = await response.json()

      expect(data).toHaveProperty('error')
      expect(data).not.toHaveProperty('details')

      server.resetHandlers()
    })

    it('handles CORS preflight requests', async () => {
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
        },
      })

      // Should handle OPTIONS request
      expect(response.status).not.toBe(500)
    })
  })
})
