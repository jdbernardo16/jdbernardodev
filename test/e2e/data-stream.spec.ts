import { test, expect } from '@playwright/test'

test('data stream waits for input, then runs', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('data-stream')).toHaveAttribute('data-hydrated', 'true')

  await page.getByTestId('data-stream-start').click()
  await expect(page.getByTestId('data-stream')).toHaveAttribute('data-status', 'ready')
  await expect(page.getByTestId('data-stream-canvas')).toBeVisible()

  await page.keyboard.press('ArrowUp')
  await expect(page.getByTestId('data-stream')).toHaveAttribute('data-status', 'playing')
  await expect(page.getByTestId('data-stream')).toHaveAttribute('data-direction', 'up')
})

test('restarts after game over without a hard refresh', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('data-stream')).toHaveAttribute('data-hydrated', 'true')

  await page.getByTestId('data-stream-start').click()
  await page.keyboard.press('ArrowUp')
  await expect(page.getByTestId('data-stream')).toHaveAttribute('data-status', 'over', {
    timeout: 10_000,
  })

  await page.getByTestId('data-stream-start').click()
  await expect(page.getByTestId('data-stream')).toHaveAttribute('data-status', 'ready')

  await page.keyboard.press('ArrowUp')
  await expect(page.getByTestId('data-stream')).toHaveAttribute('data-status', 'playing')
})
