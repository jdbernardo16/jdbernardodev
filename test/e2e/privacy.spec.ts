import { test, expect } from '@playwright/test'

test('privacy page renders', async ({ page }) => {
  const response = await page.goto('/privacy')
  expect(response?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Privacy')
  await expect(page.getByText('jdbernardo16@gmail.com').first()).toBeVisible()
})
