import { test, expect } from '@playwright/test'

test('home exposes unique metadata and person JSON-LD', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Jaydee Bernardo/)
  const description = await page.locator('meta[name="description"]').getAttribute('content')
  expect(description).toContain('AI systems')
  const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent()
  expect(jsonLd).toContain('Person')
  expect(jsonLd).toContain('Jaydee Bernardo')
})

test('case study has its own title and description', async ({ page }) => {
  await page.goto('/work/education-agent')
  await expect(page).toHaveTitle(/Grading automation agent/)
  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
  expect(ogTitle).toContain('Grading automation agent')
})

test('sitemap and robots are generated', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
})
