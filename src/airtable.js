import Airtable from 'airtable'

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: 'keyFjcjFYZGawLRmT'
})

export default Airtable.base('appfmMXKVoDUktUCK')
