const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')  // reset database

    // Add user
    await request.post('/api/users', {
      data: {
        name: 'Name1',
        username: 'username1',
        password: 'password1'
      }
    })
    
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'login' })

    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'username1', 'password1')

      const logoutButton = page.getByRole('button', { name: 'logout' })
      await expect(logoutButton).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'username1', 'WRONG_PASSWORD')

      const loginButton = page.getByRole('button', { name: 'login' })
      await expect(loginButton).toBeVisible()     

      const errorDiv = page.getByText('Incorrect username or password')

      // Really needs to be 'rgb(255, 0, 0)' instead of 'red' here.
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(errorDiv).toContainText('Incorrect username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'username1', 'password1')
    })

    test.only('a new blog can be created', async ({ page }) => {
      // click button to display the BlogForm
      await page.getByRole('button', { name: 'add new blog' }).click()

      // fill in values
      await page.getByLabel('title:').fill('title1')
      await page.getByLabel('author:').fill('author1')
      await page.getByLabel('url:').fill('url1')

      // click create button
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('title1 author1')).toBeVisible()
      await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
    })
  })
})
