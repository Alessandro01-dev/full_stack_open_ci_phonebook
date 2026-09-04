import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Filter from './Filter'

describe('<Filter />', () => {
  test('renders the current filter value', () => {
    render(<Filter filter="test" handleFilterChange={() => {}} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('test')
  })

  test('calls handleFilterChange when typing', async () => {
    const handleFilterChange = vi.fn()
    const user = userEvent.setup()

    render(<Filter filter="" handleFilterChange={handleFilterChange} />)
    const input = screen.getByRole('textbox')

    await user.type(input, 'a')

    expect(handleFilterChange).toHaveBeenCalled()
  })
})
