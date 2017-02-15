
export const lowerCaseProperties = (object) => {
  return Object.keys(object).reduce((current, key) => {
    current[key.toLowerCase()] = object[key]
    return current
  }, {})
}
