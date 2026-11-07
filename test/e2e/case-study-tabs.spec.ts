import { test, expect } from '@playwright/test'

test('case study tabs switch panels', async ({ page }) => {
  await page.goto('/work/education-agent')
  await page.getByRole('tab', { name: 'Outcome' }).click()
  await expect(page.getByRole('tabpanel', { name: 'Outcome' })).toBeVisible()
})
