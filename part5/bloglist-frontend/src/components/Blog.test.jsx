import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let mockUpdateBlog = null
  let mockOnDeleteBlog = null
  let user1 = null
  let user2 = null
  let blogOfUser1 = null
  let rerender = null

  beforeEach(() => {
    user1 = {
      username: 'test_username',
      name: 'test_name'
    }
    blogOfUser1 = {
      title: 'test_title',
      author: 'test_author',
      url: 'test_url',
      likes: 69,
      user: user1
    }
    mockUpdateBlog = vi.fn()
    mockOnDeleteBlog = vi.fn()
  })

  describe('when not logged in', () => {
    beforeEach(() => {
      render(
        <Blog
          blog={blogOfUser1}
          user={null}
          updateBlog={mockUpdateBlog}
          onDeleteBlog={mockOnDeleteBlog}
        />
      )
    })

    test('renders the blog\'s information and number of likes; buttons are not rendered', async () => {
      const user = userEvent.setup()
      const viewDetailsButton = screen.queryByText('view')
      await user.click(viewDetailsButton)

      expect(screen.queryByText('test_url')).toBeVisible()
      expect(screen.queryByText('69')).toBeVisible()
      expect(screen.queryByText('test_name')).toBeVisible()

      expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
      expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
    })
  })

  describe('when logged in', () => {
    beforeEach(() => {
      const result = render(
        <Blog
          blog={blogOfUser1}
          user={user1}
          updateBlog={mockUpdateBlog}
          onDeleteBlog={mockOnDeleteBlog}
        />
      )
      rerender = result.rerender
    })

    test('The blog\'s creator is shown both the like and delete button', async () => {
      const user = userEvent.setup()
      const viewDetailsButton = screen.queryByText('view')
      await user.click(viewDetailsButton)

      expect(screen.queryByRole('button', { name: 'like' })).toBeVisible()
      expect(screen.queryByRole('button', { name: 'remove' })).toBeVisible()
    })

    test('Authenticated users who are not the blog\'s creator are shown only the like button', async () => {
      user2 = {
        username: 'test_username2',
        name: 'test_name2'
      }
      rerender(
        <Blog
          blog={blogOfUser1}
          user={user2}
          updateBlog={mockUpdateBlog}
          onDeleteBlog={mockOnDeleteBlog}
        />
      )

      const user = userEvent.setup()
      const viewDetailsButton = screen.queryByText('view')
      await user.click(viewDetailsButton)

      expect(screen.queryByRole('button', { name: 'like' })).toBeVisible()
      expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
    })
  })

  // test('renders the blog\'s title and author, but NOT its url or likes by default', () => {
  //   const titleElem = screen.queryByText('test_title')
  //   const authorElem = screen.queryByText('test_author')
  //   const urlElem = screen.queryByText('test_url')
  //   const likesElem = screen.queryByText('69')

  //   expect(titleElem).toBeVisible()
  //   expect(authorElem).toBeVisible()
  //   expect(urlElem).toBeNull()
  //   expect(likesElem).toBeNull()
  // })

  // test('renders the blog\'s url and likes when the button controlling '
  //     + 'the shown details has been clicked', async () => {
  //   const titleElem = screen.queryByText('test_title')
  //   const authorElem = screen.queryByText('test_author')

  //   expect(titleElem).toBeVisible()
  //   expect(authorElem).toBeVisible()

  //   const user = userEvent.setup()
  //   const viewDetailsButton = screen.getByText('view')
  //   await user.click(viewDetailsButton)

  //   const urlElem = screen.queryByText('test_url')
  //   const likesElem = screen.queryByText('69')
  //   expect(urlElem).toBeVisible()
  //   expect(likesElem).toBeVisible()
  // })

  // test('if the like button is clicked twice, the corresponding event '
  //     + 'handler is called twice', async () => {
  //   const user = userEvent.setup()
  //   const viewDetailsButton = screen.getByText('view')
  //   await user.click(viewDetailsButton)
  //   const likesButton = screen.getByText('like')
  //   await user.click(likesButton)
  //   await user.click(likesButton)

  //   expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  // })
})
