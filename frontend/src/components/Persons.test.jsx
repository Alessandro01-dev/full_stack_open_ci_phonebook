import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Persons from './Persons'

describe('<Persons />', () => {
  const persons = [
    { id: '1', name: 'Arto Hellas', number: '040-123456' },
    { id: '2', name: 'Ada Lovelace', number: '39-44532352' },
  ]

  test('renders all given persons', () => {
    render(<Persons personsToShow={persons} deletePerson={() => {}} />)

    expect(screen.getByText(/Arto Hellas/)).toBeInTheDocument()
    expect(screen.getByText(/Ada Lovelace/)).toBeInTheDocument()
  })

  test('calls deletePerson with correct id when delete button is clicked', async () => {
    const deletePerson = vi.fn()
    const user = userEvent.setup()

    render(<Persons personsToShow={persons} deletePerson={deletePerson} />)

    const deleteButtons = screen.getAllByText('delete')
    await user.click(deleteButtons[0])

    expect(deletePerson).toHaveBeenCalledWith('1', 'Arto Hellas')
  })
})
