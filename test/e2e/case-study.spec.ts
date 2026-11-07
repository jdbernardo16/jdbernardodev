import { test, expect } from '@playwright/test'

test('renders a case study with problem, build, and outcome', async ({ page }) => {
  await page.goto('/work/education-agent')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Grading automation agent')
  await expect(page.getByRole('heading', { name: 'Problem' })).toBeVisible()
  await page.getByRole('tab', { name: 'Outcome' }).click()
  await expect(page.getByRole('tabpanel', { name: 'Outcome' })).toBeVisible()
  await expect(page.getByText('5x').first()).toBeVisible()
})

test('returns 404 for an unknown slug', async ({ page }) => {
  const response = await page.goto('/work/missing')
  expect(response?.status()).toBe(404)
})

test('renders without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/work/education-agent')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Grading automation agent')
})

test('home page never contains agency names', async ({ page }) => {
  await page.goto('/')
  const html = await page.content()
  expect(html).not.toContain('PNA')
  expect(html).not.toContain('DOJ')
})
