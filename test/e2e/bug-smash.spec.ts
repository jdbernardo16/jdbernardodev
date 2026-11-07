import { test, expect } from '@playwright/test'

test('bug smash starts and squashes a bug with the keyboard', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('bug-smash')).toHaveAttribute('data-hydrated', 'true')

  await page.getByTestId('bug-smash-start').click()

  const bug = page.locator('[data-bug="true"]').first()
  await expect(bug).toBeVisible()

  const index = await bug.getAttribute('data-cell-index')
  await page.keyboard.press(String(Number(index) + 1))

  await expect(page.getByText('squashed a bug')).toBeVisible()
})
