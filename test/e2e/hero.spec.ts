import { test, expect } from '@playwright/test'

test('hero renders on desktop and mobile', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Jaydee Bernardo')
  await expect(page.getByTestId('data-stream')).toBeVisible()
  await expect(page.getByTestId('data-stream')).toHaveAttribute('data-hydrated', 'true')

  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  await expect(page.getByTestId('data-stream')).toBeVisible()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(overflow).toBe(false)
})
