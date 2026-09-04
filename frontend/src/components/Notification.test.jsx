import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Notification from './Notification'

describe('<Notification />', () => {
  test('renders nothing when message is null', () => {
    const { container } = render(<Notification message={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  test('renders success message with correct class', () => {
    render(<Notification message={{ text: 'Added John', type: 'success' }} />)
    const element = screen.getByText('Added John')
    expect(element).toHaveClass('notification', 'success')
  })

  test('renders error message with correct class', () => {
    render(
      <Notification
        message={{ text: 'Something went wrong', type: 'error' }}
      />,
    )
    const element = screen.getByText('Something went wrong')
    expect(element).toHaveClass('notification', 'error')
  })
})
