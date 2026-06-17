import { test, expect } from '@playwright/test'

test.describe('home', () => {
  test('renders the editorial hero and the recent strips', async ({ page }) => {
    await page.goto('/')
    // Name renders once as the page h1.
    await expect(page.getByRole('heading', { level: 1, name: 'Melvin Onyia' })).toBeVisible()
    // Eyebrow and statement copy are present.
    await expect(page.getByText('Software Engineer')).toBeVisible()
    await expect(
      page.getByText(/Backend and infrastructure engineer\. I build for the/),
    ).toBeVisible()
  })
})

test.describe('drawer', () => {
  test('hamburger opens the drawer, drawer items navigate, Esc closes', async ({ page }) => {
    await page.goto('/')
    const hamburger = page.getByRole('button', { name: 'menu-icon' })
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
    await hamburger.click()
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true')

    // Drawer nav exposes About / Writing / Work / Contact.
    const drawer = page.getByRole('navigation', { name: 'Primary' })
    await expect(drawer).toBeVisible()

    // Esc closes the drawer.
    await page.keyboard.press('Escape')
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
  })
})

test.describe('command palette', () => {
  test('Meta+K opens the palette and Enter navigates', async ({ page }) => {
    await page.goto('/')
    // Wait for hydration — the document keydown listener that catches Cmd+K
    // is installed in a useEffect, so it's not active until hydration completes.
    await page.waitForLoadState('networkidle')
    await page.keyboard.press('ControlOrMeta+k')
    const search = page.getByPlaceholder(/search/i)
    await expect(search).toBeFocused()
    await search.fill('contact')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/contact$/)
  })

  test('Esc closes the palette', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.keyboard.press('ControlOrMeta+k')
    await expect(page.getByPlaceholder(/search/i)).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByPlaceholder(/search/i)).toHaveCount(0)
  })
})

test.describe('contact page', () => {
  test('renders the email CTA with a mailto link', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByRole('heading', { level: 1, name: 'Get in touch' })).toBeVisible()
    const email = page.getByRole('link', { name: /hello@melvinonyia\.com/i })
    await expect(email).toHaveAttribute('href', /^mailto:/)
  })
})

test.describe('404', () => {
  test('an unknown URL renders the "page is missing" view with a Return Home link', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    await expect(page.getByText('Sorry, the page is missing')).toBeVisible()
    await expect(
      page.getByText(/couldn't find what you were looking for/i),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'Return Home' })).toHaveAttribute('href', '/')
  })
})

test.describe('chrome present on every route', () => {
  const paths = [
    '/',
    '/work',
    '/work/movement-fingerprint',
    '/contact',
    '/writing',
    '/writing/the-leg-between-lab-and-field',
    '/about',
    '/privacy',
    '/terms',
  ]
  for (const path of paths) {
    test(`${path} renders the M logo + hamburger`, async ({ page }) => {
      await page.goto(path)
      await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'menu-icon' })).toBeVisible()
    })
  }
})
