import { beforeAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'

// Setup MSW server for all integration tests
export const setupMSWServer = () => {
  let server: ReturnType<typeof setupServer>

  beforeAll(() => {
    // Set environment variables for testing
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'test-weather-key'

    server = setupServer()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  return { server }
}
