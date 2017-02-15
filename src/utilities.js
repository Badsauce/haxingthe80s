
export const lowerCaseProperties = (object) => {
  return Object.keys(object).reduce((current, key) => {
    current[key.toLowerCase()] = object[key]
    return current
  }, {})
}


export const upperCaseProperties = (object) => {
  return Object.keys(object).reduce((current, key) => {
    current[key[0].toUpperCase() + key.slice(1)] = object[key]
    return current
  }, {})
}

export const removeProperties = (keysToRemove) => {
  return (objectToModify) => {
    return Object.keys(objectToModify).reduce((current, key) => {
      if (!keysToRemove.includes(key)) { current[key] = objectToModify[key] }
      return current
    }, {})
  }
}
