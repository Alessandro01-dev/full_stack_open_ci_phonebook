import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import personService from './services/persons'

vi.mock('./services/persons')

describe('<App />', () => {
  beforeEach(() => {
    personService.getAll.mockResolvedValue([
      { id: '1', name: 'Arto Hellas', number: '040-123456' },
    ])
  })

  test('renders persons fetched from the service', async () => {
    render(<App />)

    const person = await screen.findByText(/Arto Hellas/)
    expect(person).toBeInTheDocument()
  })

  test('adds a new person when the form is submitted', async () => {
    const user = userEvent.setup()

    personService.create.mockResolvedValue({
      id: '2',
      name: 'Ada Lovelace',
      number: '39-44532352',
    })

    const { container } = render(<App />)

    await waitFor(() => {
      expect(personService.getAll).toHaveBeenCalled()
    })

    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], 'Ada Lovelace')
    await user.type(inputs[1], '39-44532352')

    const button = screen.getByText('add')
    await user.click(button)

    await waitFor(() => {
      const paragraphs = container.querySelectorAll('p')
      const found = Array.from(paragraphs).some((p) =>
        p.textContent.includes('Ada Lovelace'),
      )
      expect(found).toBe(true)
    })
  })
})
