const Person = require('../models/person')

const initialPersons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    name: 'Ada Lovelace',
    number: '39-44532352',
  },
]

const nonExistingId = async () => {
  const person = new Person({
    name: 'willremovethissoon',
    number: '000-0000000',
  })
  await person.save()
  await person.deleteOne()

  return person._id.toString()
}

const personsInDb = async () => {
  const persons = await Person.find({})
  return persons.map((person) => person.toJSON())
}

module.exports = {
  initialPersons,
  nonExistingId,
  personsInDb,
}
