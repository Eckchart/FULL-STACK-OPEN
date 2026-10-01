import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let mockAddBlog = null
  beforeEach(() => {
    mockAddBlog = vi.fn()

    render(<BlogForm addBlog={mockAddBlog} />)
  })

  test('calls the event handler with the right values when a new blog is created', async () => {
    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')

    const user = userEvent.setup()
    await user.type(titleInput, 'test_title')
    await user.type(authorInput, 'test_author')
    await user.type(urlInput, 'test_url')

    const createButton = screen.getByText('create')
    await user.click(createButton)

    const expectedBlogObj = {
      title: 'test_title',
      author: 'test_author',
      url: 'test_url'
    }
    expect(mockAddBlog.mock.calls[0][0]).toEqual(expectedBlogObj)
  })
})
