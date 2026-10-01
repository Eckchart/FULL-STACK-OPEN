import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
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
    const mockUpdateBlog = vi.fn()
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
})
