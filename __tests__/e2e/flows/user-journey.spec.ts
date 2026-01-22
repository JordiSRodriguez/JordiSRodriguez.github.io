import { test, expect } from '@playwright/test'

test.describe('User Journey Tests', () => {
  test('visitor explores portfolio', async ({ page }) => {
    await page.goto('/')

    // User lands on homepage
    await expect(page.locator('h1')).toBeVisible()

    // User navigates to About section using hash
    await page.goto('/#about')
    await expect(page.locator('[data-testid="about-section"]')).toBeVisible()

    // User navigates to Projects section using hash
    await page.goto('/#projects')
    await expect(page.locator('[data-testid="projects-section"]')).toBeVisible()

    // User navigates to Contact section using hash
    await page.goto('/#contact')
    await expect(page.locator('[data-testid="contact-section"]')).toBeVisible()
  })

  test('visitor opens AI chat assistant', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load and AI chat button to be present
    await page.waitForLoadState('networkidle')

    // Trigger AI chat using keyboard shortcut with proper focus
    await page.keyboard.press('Control+I')

    // Check that AI chat modal opens (with longer timeout)
    const chatModal = page.locator('[data-testid="ai-chat-modal"]')
    await expect(chatModal).toBeVisible({ timeout: 10000 }).catch(() => {
      // If keyboard shortcut fails, try clicking the floating button
      return page.locator('button:has([class*="bg-gradient-to-br from-violet-600"]))').click().then(() => {
        return expect(chatModal).toBeVisible({ timeout: 3000 })
      })
    })

    // Close chat
    await page.keyboard.press('Escape')
    await expect(chatModal).not.toBeVisible()
  })

  test('visitor views project details', async ({ page }) => {
    await page.goto('/#projects')

    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })

    // Verify project cards are visible
    const projectCards = page.locator('[data-testid="project-card"]')
    await expect(projectCards.first()).toBeVisible()

    // Verify project details are visible within cards
    await expect(page.locator('[data-testid="project-details"]').first()).toBeVisible()
  })
})
