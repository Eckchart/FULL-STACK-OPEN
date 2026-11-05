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
    
    // 1. DB is reset while an old token remains in localStorage
    // 2. the logged-in user is deleted via a call to '/api/testing/reset',
    // but the frontend still uses that old logged-in user, with an old
    // token (it's cached in there or something).
    // so clear storage before logging in with the new user
    await page.addInitScript(() => localStorage.clear())
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

      test('only the user who added the blog sees the blog delete button', async ({ page }) => {
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

      test('blogs are arranged in decreasing order of likes', async ({ page }) => {
        await page.getByRole('button', { name: 'add new blog' }).click()
        await createBlog(page, 'title2', 'author2', 'url2')

        // this matches the two <div></div> blog elements
        const blogsDivList = page.locator('.blogs > div')
        const initialBlog1Div = blogsDivList.filter({ hasText: 'title1 author1' })
        const initialBlog2Div = blogsDivList.filter({ hasText: 'title2 author2' })

        // expand details of both blogs
        await initialBlog1Div.getByRole('button', { name: 'view' }).click()
        await initialBlog2Div.getByRole('button', { name: 'view' }).click()

        // like first blog
        await initialBlog1Div.getByRole('button', { name: 'like' }).click()

        // order should still be:
        // (blog with) title1 (1 like)
        // (blog with) title2 (0 likes)
        await expect(blogsDivList.nth(0).getByText('title1')).toBeVisible()
        await expect(blogsDivList.nth(1).getByText('title2')).toBeVisible()

        // like second blog twice, so that it gets re-ordered
        // to be the first blog in the list, like so:
        // (blog with) title2 (2 likes)
        // (blog with) title1 (1 like)
        const likeButton = initialBlog2Div.getByRole('button', { name: 'like' })
        await likeButton.click()

        // need to wait for the like count (api update) to actually update!
        await expect(initialBlog2Div).toContainText('1')

        await likeButton.click()
        await expect(initialBlog2Div).toContainText('2')

        // order should now be:
        // (blog with) title2 (2 likes)
        // (blog with) title1 (1 like)
        await expect(blogsDivList.nth(0).getByText('title2')).toBeVisible()
        await expect(blogsDivList.nth(1).getByText('title1')).toBeVisible()
      })
    })
  })
})
