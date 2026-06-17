import { test, expect } from '@playwright/test'

test.use({ colorScheme: 'dark' })

test.describe('reduced-motion sweep', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  test('Cmd-K open/close round-trip works with no animation flake', async ({ page }) => {
    await page.goto('/')
    // Wait for hydration so the document keydown listener is installed.
    await page.waitForLoadState('networkidle')
    await page.keyboard.press('ControlOrMeta+k')
    await expect(page.getByPlaceholder(/search/i)).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByPlaceholder(/search/i)).toHaveCount(0)
  })

  test('hamburger drawer toggles and Esc closes under reduced motion', async ({ page }) => {
    await page.goto('/')
    const hamburger = page.getByRole('button', { name: 'menu-icon' })
    await hamburger.click()
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Escape')
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
  })

  test('navigating from home → /writing under reduced motion lands cleanly', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.keyboard.press('ControlOrMeta+k')
    await page.getByPlaceholder(/search/i).fill('writing')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/writing$/)
  })
})
