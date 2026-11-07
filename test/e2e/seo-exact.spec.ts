import { test, expect } from '@playwright/test'

test('page titles are not double-suffixed', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Jaydee Bernardo — Senior AI Engineer & Full-Stack Developer')

  await page.goto('/work/education-agent')
  await expect(page).toHaveTitle('Grading automation agent — Jaydee Bernardo')

  await page.goto('/privacy')
  await expect(page).toHaveTitle('Privacy — Jaydee Bernardo')
})
