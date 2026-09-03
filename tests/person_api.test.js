const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Person = require('../models/person')
const helper = require('./test_helper')

beforeEach(async () => {
  await Person.deleteMany({})
  await Person.insertMany(helper.initialPersons)
})

describe('when there are initially some persons saved', () => {
  test('persons are returned as json', async () => {
    await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all persons are returned', async () => {
    const response = await api.get('/api/persons')
    assert.strictEqual(response.body.length, helper.initialPersons.length)
  })

  test('a specific person is within the returned persons', async () => {
    const response = await api.get('/api/persons')
    const names = response.body.map((p) => p.name)
    assert(names.includes('Arto Hellas'))
  })
})

describe('viewing a specific person', () => {
  test('succeeds with a valid id', async () => {
    const personsAtStart = await helper.personsInDb()
    const personToView = personsAtStart[0]

    const resultPerson = await api
      .get(`/api/persons/${personToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultPerson.body, personToView)
  })

  test('fails with statuscode 404 if person does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api.get(`/api/persons/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api.get(`/api/persons/${invalidId}`).expect(400)
  })
})

describe('addition of a new person', () => {
  test('succeeds with valid data', async () => {
    const newPerson = {
      name: 'Alice Wonderland',
      number: '040-1234567',
    }

    await api
      .post('/api/persons')
      .send(newPerson)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const personsAtEnd = await helper.personsInDb()
    assert.strictEqual(personsAtEnd.length, helper.initialPersons.length + 1)

    const names = personsAtEnd.map((p) => p.name)
    assert(names.includes('Alice Wonderland'))
  })

  test('fails with statuscode 400 if name is missing', async () => {
    const newPerson = {
      number: '040-1234567',
    }

    await api.post('/api/persons').send(newPerson).expect(400)

    const personsAtEnd = await helper.personsInDb()
    assert.strictEqual(personsAtEnd.length, helper.initialPersons.length)
  })

  test('fails with statuscode 400 if number is missing', async () => {
    const newPerson = {
      name: 'No Number',
    }

    await api.post('/api/persons').send(newPerson).expect(400)

    const personsAtEnd = await helper.personsInDb()
    assert.strictEqual(personsAtEnd.length, helper.initialPersons.length)
  })
})

describe('deletion of a person', () => {
  test('succeeds with statuscode 204 if id is valid', async () => {
    const personsAtStart = await helper.personsInDb()
    const personToDelete = personsAtStart[0]

    await api.delete(`/api/persons/${personToDelete.id}`).expect(204)

    const personsAtEnd = await helper.personsInDb()
    assert.strictEqual(personsAtEnd.length, helper.initialPersons.length - 1)

    const names = personsAtEnd.map((p) => p.name)
    assert(!names.includes(personToDelete.name))
  })
})

describe('updating a person', () => {
  test('succeeds with valid data', async () => {
    const personsAtStart = await helper.personsInDb()
    const personToUpdate = personsAtStart[0]

    const updatedData = {
      name: personToUpdate.name,
      number: '999-9999999',
    }

    const response = await api
      .put(`/api/persons/${personToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.number, '999-9999999')
  })
})

after(async () => {
  await mongoose.connection.close()
})
