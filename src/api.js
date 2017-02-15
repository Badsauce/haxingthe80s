import Airtable from './airtable'
import { lowerCaseProperties, removeProperties, upperCaseProperties } from './utilities'

const ideasTable = Airtable('Ideas')
const commentsTable = Airtable('Comments')
const peopleTable = Airtable('People')

export const transformRecords = (records) => {
  return records.map(record => {
    return {
      ...lowerCaseProperties(record.fields),
      id: record.getId()
    }
  })
}

const select = (table, view) => {
  return new Promise((resolve, reject) => {
    const results = []
    table.select({
      maxRecords: 20,
      view
    }).eachPage(
      (records, fetchNextPage) => {
        results.push(...records)
        fetchNextPage()
      }, (err) => {
        if (err) {
          return reject(err)
        }
        return resolve(transformRecords(results))
      }
    )
  })
}

const create = (table, data) => {
  return new Promise((resolve, reject) => {
    table.create(data, (err, record) => {
      if (err) {
        return reject(err)
      }
      return resolve(record)
    })
  })
}

const update = (table, data, blacklist) => {
  return new Promise((resolve, reject) => {
    const { id, ...updatedFields } = data
    if (!id) { return reject('ID should be provided') }

    const fieldsToSend = removeProperties(blacklist)(updatedFields)
    table.update(id, upperCaseProperties(fieldsToSend), (err, record) => {
      if (err) {
        return reject(err)
      }
      return resolve(record)
    })
  })
}

const destroy = (table, data, blacklist) => {
  return new Promise((resolve, reject) => {
    const { id } = data
    if (!id) { return reject('ID should be provided') }

    table.destroy(data.id, (err, record) => {
      if (err) {
        return reject(err)
      }
      return resolve(record)
    })
  })
}

export const getIdeas = () => {
  return select(ideasTable, 'Approved')
}

export const getComments = () => {
  return select(commentsTable, 'Main View')
}

export const getPeople = () => {
  return select(peopleTable, 'Main View')
}

export const createIdea = (data) => {
  return create(ideasTable, data)
}

export const createComment = (data) => {
  return create(commentsTable, data)
}

export const createPeople = (data) => {
  return create(peopleTable, data)
}

export const updateIdea = (data) => {
  return update(ideasTable, data, [
    'comments',
    'creator',
  ])
}

export const updateComment = (data) => {
  return update(commentsTable, data, [
    'idea',
    'creator',
  ])
}

export const updatePeople = (data) => {
  return update(peopleTable, data, [
    'ideas',
    'comments',
  ])
}

export const destroyIdea = (data) => {
  return destroy(ideasTable, data)
}

export const destroyComment = (data) => {
  return destroy(commentsTable, data)
}

export const destroyPeople = (data) => {
  return destroy(peopleTable, data)
}

export const upvoteIdea = (data, person) => {
  if (!data.id || !person.id) return Promise.reject('Missing ID on idea or person')
  if (data.upvotes.includes(person.id)) return Promise.reject('Already upvoted')

  if (data.downvotes.includes(person.id)) {
    return updateIdea({
      id: data,
      downvotes: data.downvotes.filter(vote => vote === person.id),
    })
  }
  return updateIdea({
    id: data,
    upvotes: [
      ...data.upvotes,
      person.id,
    ],
  })
}

export const downvoteIdea = (data, person) => {
  if (!data.id || !person.id) return Promise.reject('Missing ID on idea or person')
  if (data.downvotes.includes(person.id)) return Promise.reject('Already downvoted')

  if (data.upvotes.includes(person.id)) {
    return updateIdea({
      id: data,
      upvotes: data.upvotes.filter(vote => vote === person.id),
    })
  }
  return updateIdea({
    id: data,
    downvotes: [
      ...data.downvotes,
      person.id,
    ],
  })
}
