import { test, expect } from '@playwright/test'

test.describe('Portfolio Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/')

    // Check that the page loaded
    await expect(page).toHaveTitle(/Jordi Sumba/)
  })

  test('has working navigation', async ({ page }) => {
    await page.goto('/')

    // Test navigation to About section using hash
    await page.goto('/#about')
    await expect(page).toHaveURL(/#about/)

    // Test navigation to Projects section using hash
    await page.goto('/#projects')
    await expect(page).toHaveURL(/#projects/)
  })

  test('displays hero section', async ({ page }) => {
    await page.goto('/')

    // Check for hero content
    const hero = page.locator('h1')
    await expect(hero).toBeVisible()
  })

  test('is mobile responsive', async ({ page, viewport }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check for mobile navigation (floating dock)
    const mobileNav = page.locator('[data-testid="mobile-dock"]')
    await expect(mobileNav).toBeVisible()
  })

  test('loads stats section', async ({ page }) => {
    await page.goto('/')

    // Scroll to stats section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Wait for stats to load
    await page.waitForSelector('[data-testid="stats-section"]', { timeout: 5000 })
  })
})
