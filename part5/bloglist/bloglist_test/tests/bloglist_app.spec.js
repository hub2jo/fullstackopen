const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'world2030'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    const loginForm = page.getByRole('form', { name: 'login form' })
    await expect(loginForm).toBeVisible()
    const usernameInput = page.getByRole('textbox', { name: 'username' })
    await expect(usernameInput).toBeVisible()
    const passwordInput = page.getByRole('textbox', { name: 'password' })
    await expect(passwordInput).toBeVisible()
    const loginButton = page.getByRole('button', { name: 'login' })
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'world2030')
      const userInfo = page.getByText('Matti Luukkainen logged in')
      await expect(userInfo).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'world2030')
    })

    test('a blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'playwright', 'http://playright.test.example.org')
      await expect(page.getByText('a blog created by playwright by playwright')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'playwright', 'http://playright.test.example.org')
      const viewButton = page.getByRole('button', { name: 'view' })
      await viewButton.click()
      const likeButton = page.getByRole('button', { name: 'like' })
      await likeButton.click()
      const likesText = page.getByText('1 likes')
      await expect(likesText).toBeVisible()
    })

    test('a blog can be deleted by the user who created it', async ({ page }) => {
      test.setTimeout(30000)
      await createBlog(page, 'a blog created by playwright', 'playwright', 'http://playright.test.example.org')
      await expect(page.locator('.success')).not.toBeVisible({ timeout: 10000 })
      const viewButton = page.getByRole('button', { name: 'view' })
      await viewButton.click()
      const removeButton = page.getByRole('button', { name: 'remove' })
      page.on('dialog', dialog => dialog.accept())
      await removeButton.click()
      await expect(page.getByText('a blog created by playwright by playwright')).not.toBeVisible()
    })

    test('blogs are ordered according to likes', async ({ page }) => {
       test.setTimeout(30000)
      await createBlog(page, 'first blog', 'playwright', 'http://playright.test.example.org')
      await createBlog(page, 'second blog', 'playwright', 'http://playright.test.example.org')
      await createBlog(page, 'third blog', 'playwright', 'http://playright.test.example.org')

      const viewButtons = page.getByRole('button', { name: 'view' })
      await viewButtons.nth(2).click()
      await viewButtons.nth(1).click()
      await viewButtons.nth(0).click()

      const likeButtons = page.getByRole('button', { name: 'like' })

      await likeButtons.nth(0).click()
      await expect(page.getByText('1 likes').first()).toBeVisible()
      await likeButtons.nth(0).click()
      await expect(page.getByText('2 likes').first()).toBeVisible()
      await likeButtons.nth(0).click()
      await expect(page.getByText('3 likes').first()).toBeVisible()

      await likeButtons.nth(1).click()
      await expect(page.getByText('1 likes').first()).toBeVisible()
      await likeButtons.nth(1).click()
      await expect(page.getByText('2 likes').first()).toBeVisible()

      await likeButtons.nth(2).click()
      await expect(page.getByText('1 likes').first()).toBeVisible()

      const blogElements = page.locator('.blog')
      await expect(blogElements.nth(0)).toContainText('first blog')   // 3 likes
      await expect(blogElements.nth(1)).toContainText('second blog')  // 2 likes
      await expect(blogElements.nth(2)).toContainText('third blog')   // 1 like
    })
  })

  test('delete button is only visible to the user who created the blog', async ({ page, request }) => {
    await loginWith(page, 'mluukkai', 'world2030')
    await createBlog(page, 'a blog created by playwright', 'playwright', 'http://playright.test.example.org')
    const viewButton = page.getByRole('button', { name: 'view' })
    await viewButton.click()
    const removeButton = page.getByRole('button', { name: 'remove' })
    await expect(removeButton).toBeVisible()

    await page.getByRole('button', { name: 'logout' }).click()

    await request.post('/api/users', {
      data: {
        name: 'Other User',
        username: 'otheruser',
        password: 'password123'
      }
    })

    await loginWith(page, 'otheruser', 'password123')
    await viewButton.click()
    await expect(removeButton).not.toBeVisible()
  })
})