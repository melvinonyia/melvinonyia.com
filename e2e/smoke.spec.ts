import { test, expect } from '@playwright/test'

test.describe('home', () => {
  test('renders the hero above the fold and the numbered case-study index', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Melvin Onyia' })).toBeVisible()
    await expect(
      page.getByText('Building software at the intersection of biomechanics and engineering.'),
    ).toBeVisible()
    // Two case studies today: movement-fingerprint and gait-lab-toolkit.
    // The redesign's home renders them as an editorial index — each row is
    // a ViewTransitionLink rendered as an <a> inside [data-work-cards].
    await expect(page.locator('[data-work-cards] a')).toHaveCount(2)
  })
})

test.describe('command palette', () => {
  test('Meta+K opens the palette, search filters, Enter navigates', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Meta+k')
    const search = page.getByPlaceholder(/search/i)
    await expect(search).toBeFocused()
    await search.fill('fingerprint')
    const firstHit = page.getByRole('option', { name: /Movement fingerprint/i })
    await expect(firstHit).toHaveAttribute('aria-selected', 'true')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/work\/movement-fingerprint$/)
    await expect(page.getByRole('heading', { name: 'Movement fingerprint' })).toBeVisible()
  })

  test('Esc closes the palette', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Meta+k')
    await expect(page.getByPlaceholder(/search/i)).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByPlaceholder(/search/i)).toHaveCount(0)
  })

  test('clicking the header ⌘K chip opens the palette', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-palette-trigger]').first().click()
    await expect(page.getByPlaceholder(/search/i)).toBeFocused()
  })
})

test.describe('navigation', () => {
  test('clicking a case-study card on home navigates to the detail page', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('[data-work-cards] a').first()
    const href = await card.getAttribute('href')
    expect(href).toMatch(/^\/work\//)
    await card.click()
    await expect(page).toHaveURL(new RegExp(href!.replace(/[/]/g, '\\/') + '$'))
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})

test.describe('contact form', () => {
  test('happy path: mocked 200 → inline success', async ({ page }) => {
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })
    await page.goto('/contact')
    await page.getByLabel(/name/i).fill('Sam Tester')
    await page.getByLabel(/email/i).fill('sam@example.com')
    await page.getByLabel(/message/i).fill('A short hello from Playwright.')
    await page.getByRole('button', { name: /Send message/i }).click()
    await expect(page.getByRole('status')).toContainText(/thank/i)
    await expect(page.getByLabel(/name/i)).toHaveCount(0)
  })

  test('rate-limit response → inline error and form stays', async ({ page }) => {
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false, error: 'rate-limit' }),
      })
    })
    await page.goto('/contact')
    await page.getByLabel(/name/i).fill('Sam')
    await page.getByLabel(/email/i).fill('sam@example.com')
    await page.getByLabel(/message/i).fill('hello')
    await page.getByRole('button', { name: /Send message/i }).click()
    await expect(page.getByRole('alert')).toContainText(/too many/i)
    await expect(page.getByLabel(/name/i)).toBeVisible()
  })
})

test.describe('404', () => {
  test('an unknown URL renders the on-brand 404 without a hydration flash', async ({ page }) => {
    await page.goto('/blog/this-does-not-exist')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Off the map.' }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /Take me home/ })).toHaveAttribute('href', '/')
  })
})

test.describe('per-route palette', () => {
  const cases: Array<{ path: string; palette: 'dark' | 'paper' }> = [
    { path: '/', palette: 'dark' },
    { path: '/work', palette: 'dark' },
    { path: '/work/movement-fingerprint', palette: 'dark' },
    { path: '/contact', palette: 'dark' },
    { path: '/writing', palette: 'paper' },
    { path: '/writing/the-leg-between-lab-and-field', palette: 'paper' },
    { path: '/about', palette: 'paper' },
  ]
  for (const { path, palette } of cases) {
    test(`${path} renders with data-palette="${palette}"`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('html')).toHaveAttribute('data-palette', palette)
    })
  }
})

test.describe('masthead present on every route', () => {
  const paths = [
    '/',
    '/work',
    '/work/movement-fingerprint',
    '/contact',
    '/writing',
    '/writing/the-leg-between-lab-and-field',
    '/about',
  ]
  for (const path of paths) {
    test(`${path} renders the masthead with wordmark`, async ({ page }) => {
      await page.goto(path)
      const banner = page.getByRole('banner')
      await expect(banner).toBeVisible()
      await expect(banner.getByRole('link', { name: 'Melvin Onyia' })).toBeVisible()
      await expect(banner.getByRole('navigation', { name: 'Primary' })).toBeVisible()
    })
  }
})
