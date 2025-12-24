/* global localStorage */

const ebBookmarksGetLocalStorage = ({ prefix, excludePrefix, excludeType }) => {
  const results = []
  Object.keys(localStorage).forEach(function (key) {
    const result = key.startsWith(prefix) && (!excludePrefix || !key.startsWith(excludePrefix)) ? JSON.parse(localStorage.getItem(key)) : null
    if (result && (!excludeType || result.type !== excludeType)) {
      results.push(result)
    }
  })
  return results
}

export default ebBookmarksGetLocalStorage
