const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    // reset database
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'Salain3n!'
      }
    })
    
    await page.goto('/')
  })
  
  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, ' +
      'University of Helsinki 2025')).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'Salain3n!')

    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrong')

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials!')  // case sensitive!!
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'Salain3n!')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')

      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })
  
    describe('and several notes exist', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test('one of those can be made nonimportant', async ({ page }) => {
        const secondNoteElement = page.getByText('second note').locator('..')
        await secondNoteElement
          .getByRole('button', { name: 'make not important' }).click()

        await expect(secondNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})
