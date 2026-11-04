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
})
