import { test, expect } from '@playwright/test'

test.use({ colorScheme: 'dark' })

test.describe('reduced-motion sweep', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  test('hover lift becomes instant (data-reduced-motion="true")', async ({ page }) => {
    await page.goto('/')
    const lifts = page.locator('[data-hover-lift]')
    const count = await lifts.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      await expect(lifts.nth(i)).toHaveAttribute('data-reduced-motion', 'true')
    }
  })

  test('Cmd-K open/close round-trip works with no animation flake', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Meta+k')
    await expect(page.getByPlaceholder(/search/i)).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByPlaceholder(/search/i)).toHaveCount(0)
  })

  test('view-transition links navigate (browser falls back to plain navigation)', async ({
    page,
  }) => {
    await page.goto('/work')
    const firstCard = page.locator('article a').first()
    const href = await firstCard.getAttribute('href')
    expect(href).toMatch(/^\/work\//)
    await firstCard.click()
    await expect(page).toHaveURL(new RegExp(href!.replace(/[/]/g, '\\/') + '$'))
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('dark→paper palette change on / → /writing is instant (no wipe runs)', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'dark')
    await page.getByRole('link', { name: /Writing/i }).first().click()
    await expect(page).toHaveURL(/\/writing$/)
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'paper')
    // The wipe marker should never have been set under reduced-motion.
    await expect(page.locator('html')).not.toHaveAttribute('data-palette-transition', 'true')
  })
})
