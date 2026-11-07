import { test, expect } from '@playwright/test'

test('reduced motion keeps the site readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  await expect(page.getByText('AI systems that automate real work.')).toBeVisible()
  await expect(page.getByTestId('bug-smash')).toBeVisible()
  await expect(page.getByTestId('bug-smash')).toHaveAttribute('data-hydrated', 'true')
  await expect(page.getByText('Bug Smash is paused.')).toBeVisible()
  await expect(page.getByTestId('ambient-graph')).toBeVisible()
  await expect(page.locator('[data-reduced]').first()).toHaveAttribute('data-reduced', 'true')

  await expect(page.locator('[data-testid="console-line"]')).toHaveCount(3)
  await expect(page.locator('[data-testid="console-play"]')).toBeHidden()
})
