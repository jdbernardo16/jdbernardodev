import { test, expect } from '@playwright/test'

test('core content renders without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()

  await page.goto('/')
  await expect(page.getByText('AI systems that automate real work.')).toBeVisible()
  await expect(page.getByRole('link', { name: 'jdbernardo16@gmail.com' }).first()).toBeVisible()

  await page.goto('/privacy')
  await expect(page.getByText('jdbernardo16@gmail.com').first()).toBeVisible()

  const studies = [
    ['education-agent', 'Grading automation agent'],
    ['mt5-agent', 'MT5 operations agent'],
    ['ecommerce-agent', 'Order monitoring agent'],
    ['real-estate-agent', 'CRM-aware property assistant'],
  ] as const

  for (const [slug, title] of studies) {
    await page.goto(`/work/${slug}`)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(title)
  }
})
