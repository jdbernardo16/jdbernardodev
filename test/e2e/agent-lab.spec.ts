import { test, expect } from '@playwright/test'

test('hero game completes the first mission', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('agent-lab')).toBeVisible()
  await expect(page.getByTestId('agent-lab')).toHaveAttribute('data-hydrated', 'true')
  await page.getByTestId('node-watch-market').click()
  await page.getByTestId('node-check-stock').click()
  await page.getByTestId('node-notify-owner').click()
  await page.getByTestId('node-log-order').click()
  await page.getByTestId('agent-run').click()
  await expect(page.getByText('mission complete')).toBeVisible()
})
