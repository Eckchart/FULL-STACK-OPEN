import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let mockUpdateBlog = null

  beforeEach(() => {
    const user = {
      username: 'test_username',
      name: 'test_name'
    }
    const blog = {
      title: 'test_title',
      author: 'test_author',
      url: 'test_url',
      likes: 69,
      user
    }
    mockUpdateBlog = vi.fn()
    const mockOnDeleteBlog = vi.fn()

    render(
      <Blog
        blog={blog}
        loggedInUser={user}
        updateBlog={mockUpdateBlog}
        onDeleteBlog={mockOnDeleteBlog}
      />
    )
  })

  test('renders the blog\'s title and author, but NOT its url or likes by default', () => {
    const titleElem = screen.queryByText('test_title')
    const authorElem = screen.queryByText('test_author')
    const urlElem = screen.queryByText('test_url')
    const likesElem = screen.queryByText('69')

    expect(titleElem).toBeVisible()
    expect(authorElem).toBeVisible()
    expect(urlElem).toBeNull()
    expect(likesElem).toBeNull()
  })

  test('renders the blog\'s url and likes when the button controlling '
      + 'the shown details has been clicked', async () => {
    const titleElem = screen.queryByText('test_title')
    const authorElem = screen.queryByText('test_author')

    expect(titleElem).toBeVisible()
    expect(authorElem).toBeVisible()

    const user = userEvent.setup()
    const viewDetailsButton = screen.getByText('view')
    await user.click(viewDetailsButton)

    const urlElem = screen.queryByText('test_url')
    const likesElem = screen.queryByText('69')
    expect(urlElem).toBeVisible()
    expect(likesElem).toBeVisible()
  })

  test('if the like button is clicked twice, the corresponding event '
      + 'handler is called twice', async () => {
    const user = userEvent.setup()
    const viewDetailsButton = screen.getByText('view')
    await user.click(viewDetailsButton)
    const likesButton = screen.getByText('like')
    await user.click(likesButton)
    await user.click(likesButton)

    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })
})
