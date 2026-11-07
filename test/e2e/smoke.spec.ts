import { test, expect } from '@playwright/test'

test('home renders the owner name', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Jaydee Bernardo')
})
