const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')  // reset database

    // Add users
    await request.post('/api/users', {
      data: {
        name: 'Name1',
        username: 'username1',
        password: 'password1'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Name2',
        username: 'username2',
        password: 'password2'
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

    describe('and a blog was created', () => {
      beforeEach(async ({ page }) => {
        // click button to display the BlogForm
        await page.getByRole('button', { name: 'add new blog' }).click()
        await createBlog(page, 'title1', 'author1', 'url1')
      })

      test('a new blog can be created', async ({ page }) => {
        await expect(page.getByText('title1 author1')).toBeVisible()
        await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
      })

      test('a blog can be liked', async ({ page }) => {
        // expand blog details
        await page.getByRole('button', { name: 'view' }).click()
        const likeButton = page.getByRole('button', { name: 'like' })
        await likeButton.click()

        // blog should have exactly 1 like since it's newly created
        const likeDiv = likeButton.locator('..')
        await expect(likeDiv).toContainText('1')
      })

      test('the user who added the blog can delete the blog', async ({ page }) => {
        // expand blog details
        await page.getByRole('button', { name: 'view' }).click()

        // page.once runs only for the next occurrence of window.confirm()
        page.once('dialog', async (dialog) => {
          expect(dialog.type()).toBe('confirm')
          expect(dialog.message()).toBe('Remove blog title1 by author1')

          await dialog.accept()
        })

        // click remove button and accept the window.confirm() dialog
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('title1 author1')).not.toBeVisible()
      })

      test.only('only the user who added the blog sees the blog delete button', async ({ page }) => {
        // expand blog details
        await page.getByRole('button', { name: 'view' }).click()

        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

        // logout
        await page.getByRole('button', { name: 'logout' }).click()

        // login as another user
        await loginWith(page, 'username2', 'password2')

        // expand blog details
        await page.getByRole('button', { name: 'view' }).click()

        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      
    })
  })
})
