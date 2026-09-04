import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PersonForm from './PersonForm'

describe('<PersonForm />', () => {
  test('calls addName when the form is submitted', async () => {
    const addName = vi.fn((event) => event.preventDefault())
    const user = userEvent.setup()

    render(
      <PersonForm
        addName={addName}
        newName="Arto Hellas"
        handleNameChange={() => {}}
        newNumber="040-123456"
        handleNumberChange={() => {}}
      />,
    )

    const button = screen.getByText('add')
    await user.click(button)

    expect(addName).toHaveBeenCalledTimes(1)
  })

  test('input fields show the given values', () => {
    render(
      <PersonForm
        addName={() => {}}
        newName="Arto Hellas"
        handleNameChange={() => {}}
        newNumber="040-123456"
        handleNumberChange={() => {}}
      />,
    )

    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveValue('Arto Hellas')
    expect(inputs[1]).toHaveValue('040-123456')
  })
})
