import Airtable from './airtable'
import { lowerCaseProperties } from './utilities'

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
        if (err) { reject(err) }
        resolve(transformRecords(results))
      }
    )
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
