import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const defaultBlog = {
  title: 'Component testing is done with react-testing-library',
  author: 'vitest',
  url: 'https://example.com',
  likes: 5
}

const renderBlog = (blogOverrides = {}, propOverrides = {}) => {
  const mockUpdateBlog = vi.fn()
  const mockDeleteBlog = vi.fn()

  render(
    <Blog
      blog={{ ...defaultBlog, ...blogOverrides }}
      updateBlog={mockUpdateBlog}
      deleteBlog={mockDeleteBlog}
      currentUser={null}
      {...propOverrides}
    />
  )

  return { mockUpdateBlog, mockDeleteBlog }
}

describe('<Blog />', () => {
  test('renders title and author, but not url and likes by default', () => {
    renderBlog()

    const titleElements = screen.getAllByText(/Component testing is done with react-testing-library/i)
    const authorElements = screen.getAllByText(/vitest/i)
    expect(titleElements.length).toBeGreaterThan(0)
    expect(authorElements.length).toBeGreaterThan(0)

    const urlElement = screen.getAllByText(/https:\/\/example\.com/i)
    const likesElement = screen.getAllByText(/5 likes/i)
    expect(urlElement[0]).not.toBeVisible()
    expect(likesElement[0]).not.toBeVisible()
  })

  test('renders url and likes when the view button is clicked', async () => {
    renderBlog()
    const user = userEvent.setup()
    await user.click(screen.getByText('view'))

    expect(screen.getByText(/https:\/\/example\.com/i)).toBeVisible()
    expect(screen.getByText(/5 likes/i)).toBeVisible()
  })

  test('clicking the like button twice calls event handler twice', async () => {
    const { mockUpdateBlog } = renderBlog()
    const user = userEvent.setup()

    await user.click(screen.getAllByText('view')[0])
    const likeButton = screen.getAllByText('like')[0]
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })
})