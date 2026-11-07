import { test, expect } from '@playwright/test'

test('case study tabs support arrow keys', async ({ page }) => {
  await page.goto('/work/education-agent')

  const readme = page.getByRole('tab', { name: 'README' })
  await readme.focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Flow' })).toHaveAttribute('aria-selected', 'true')

  await page.keyboard.press('End')
  await expect(page.getByRole('tab', { name: 'Outcome' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel', { name: 'Outcome' })).toBeVisible()
})
