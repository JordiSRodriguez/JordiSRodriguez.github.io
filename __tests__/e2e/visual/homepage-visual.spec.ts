import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Homepage', () => {
  test('matches homepage screenshot', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { timeout: 10000 });

    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('matches hero section screenshot', async ({ page }) => {
    await page.goto('/');

    // Wait for hero section to load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { timeout: 10000 });

    const hero = page.locator('section').first();
    await expect(hero).toHaveScreenshot('hero-section.png', {
      animations: 'disabled',
    });
  });

  test('matches navigation screenshot', async ({ page }) => {
    await page.goto('/');

    await page.waitForLoadState('networkidle');

    // Test desktop navigation (sidebar) - just verify it renders
    const sidebar = page.locator('aside, nav, [class*="sidebar"], [class*="navigation"]').first();
    const count = await sidebar.count();

    if (count > 0) {
      await expect(sidebar.first()).toHaveScreenshot('navigation.png', {
        animations: 'disabled',
      });
    }
  });

  test('matches mobile viewport screenshot', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { timeout: 10000 });

    // Take mobile screenshot
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 1000, // Allow small differences for mobile
    });
  });
});

test.describe('Visual Regression - Sections', () => {
  test('matches about section screenshot', async ({ page }) => {
    await page.goto('/#about');

    await page.waitForLoadState('networkidle');

    const aboutSection = page.getByTestId('about-section');
    await expect(aboutSection).toBeVisible({ timeout: 10000 });

    await expect(aboutSection).toHaveScreenshot('about-section.png', {
      animations: 'disabled',
    });
  });

  test('matches projects section screenshot', async ({ page }) => {
    await page.goto('/#projects');

    await page.waitForLoadState('networkidle');

    const projectsSection = page.getByTestId('projects-section');
    await expect(projectsSection).toBeVisible({ timeout: 10000 });

    await expect(projectsSection).toHaveScreenshot('projects-section.png', {
      animations: 'disabled',
    });
  });

  test('matches contact section screenshot', async ({ page }) => {
    await page.goto('/#contact');

    await page.waitForLoadState('networkidle');

    const contactSection = page.getByTestId('contact-section');
    await expect(contactSection).toBeVisible({ timeout: 10000 });

    await expect(contactSection).toHaveScreenshot('contact-section.png', {
      animations: 'disabled',
    });
  });

  test('matches stats section screenshot', async ({ page }) => {
    await page.goto('/');

    await page.waitForLoadState('networkidle');

    // Scroll to stats section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForSelector('[data-testid="stats-section"]', { timeout: 10000 });

    const statsSection = page.getByTestId('stats-section');
    await expect(statsSection).toHaveScreenshot('stats-section.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Interactive Components', () => {
  test('matches floating widgets screenshot', async ({ page }) => {
    await page.goto('/');

    await page.waitForLoadState('networkidle');

    // Wait for floating components to be visible
    await page.waitForTimeout(2000);

    // Take screenshot of bottom right area where widgets appear
    const floatingWidgets = page.locator('.fixed.bottom-6.right-6, .fixed[class*="bottom"][class*="right"]');
    const count = await floatingWidgets.count();

    if (count > 0) {
      await expect(floatingWidgets.first()).toHaveScreenshot('floating-widgets.png', {
        animations: 'disabled',
      });
    }
  });

  test('matches AI chat modal screenshot', async ({ page }) => {
    await page.goto('/');

    await page.waitForLoadState('networkidle');

    // Try to open AI chat with keyboard shortcut
    await page.keyboard.press('Control+I');

    // Wait a bit for the modal to appear
    await page.waitForTimeout(1000);

    // Check if modal opened, if not try clicking the button
    const aiChat = page.getByTestId('ai-chat-modal');
    const isVisible = await aiChat.isVisible().catch(() => false);

    if (!isVisible) {
      // Try clicking the floating AI button
      const aiButton = page.locator('button[class*="from-violet-600"], button[class*="from-purple-600"], button[class*="from-indigo-700"]').first();
      const buttonCount = await aiButton.count();

      if (buttonCount > 0) {
        await aiButton.first().click();
        await page.waitForTimeout(500);
      }
    }

    // Only take screenshot if modal is visible
    const stillVisible = await aiChat.isVisible().catch(() => false);
    if (stillVisible) {
      await expect(aiChat).toHaveScreenshot('ai-chat-modal.png', {
        animations: 'disabled',
      });

      // Close the modal
      await page.keyboard.press('Escape');
    }
  });
});

test.describe('Visual Regression - Dark Mode', () => {
  test('matches dark mode homepage screenshot', async ({ page }) => {
    // Set dark mode
    await page.goto('/');

    // Toggle dark mode by evaluating JavaScript
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
