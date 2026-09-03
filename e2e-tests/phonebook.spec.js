const { test, describe, expect } = require('@playwright/test')

describe('Phonebook', () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('')
    await expect(page.getByText('Phonebook')).toBeVisible()
    await expect(page.getByText('Add a new')).toBeVisible()
  })

  test('user can add a new person', async ({ page }) => {
    await page.goto('')

    const uniqueName = `Test Person ${Date.now()}`

    await page.getByRole('textbox').nth(1).fill(uniqueName)
    await page.getByRole('textbox').nth(2).fill('040-1234567')
    await page.getByRole('button', { name: 'add' }).click()

    await expect(page.locator('p', { hasText: uniqueName })).toBeVisible()
  })

  test('user can delete a person', async ({ page }) => {
    await page.goto('')

    const uniqueName = `Delete Me ${Date.now()}`

    await page.getByRole('textbox').nth(1).fill(uniqueName)
    await page.getByRole('textbox').nth(2).fill('040-7654321')
    await page.getByRole('button', { name: 'add' }).click()

    const personRow = page.locator('p', { hasText: uniqueName })
    await expect(personRow).toBeVisible()

    page.once('dialog', (dialog) => dialog.accept())
    await personRow.getByRole('button', { name: 'delete' }).click()

    await expect(page.locator('p', { hasText: uniqueName })).not.toBeVisible()
  })

  test('user can filter persons by name', async ({ page }) => {
    await page.goto('')

    const uniqueName = `Filter Test ${Date.now()}`

    await page.getByRole('textbox').nth(1).fill(uniqueName)
    await page.getByRole('textbox').nth(2).fill('040-1112222')
    await page.getByRole('button', { name: 'add' }).click()

    await expect(page.locator('p', { hasText: uniqueName })).toBeVisible()

    await page.getByRole('textbox').nth(0).fill('Filter Test')

    await expect(page.locator('p', { hasText: uniqueName })).toBeVisible()
  })
})
