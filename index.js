const hash = require('object-hash')

module.exports.createPatch = function createPatch (arr1, arr2) {
  var changes = []

  var a = Object.assign([], arr1).map(k => hash(k))
  var b = Object.assign([], arr2).map(k => hash(k))

  var map = Object.assign({}, a)
  Object.keys(map).map(k => {
    map[k] = null
  })

  Object.keys(map).map(k => {
    if (a[k] === b[k]) map[k] = k
  })

  let lastRightSideMatch = 0
  Object.keys(map).map(k => {
    if (map[k] !== null) {
      lastRightSideMatch = map[k]
      return
    }

    var nextMatch
    nextMatch = Object.keys(map).slice(parseInt(k)).find(k => map[k] !== null)

    if (nextMatch) nextMatch = parseInt(nextMatch)

    var found = null
    b.slice(parseInt(lastRightSideMatch), nextMatch).find((v, i) => {
      if (v !== a[k]) return false

      found = `${i + parseInt(lastRightSideMatch)}`
      return true
    })

    map[k] = found
  })

  lastRightSideMatch = null
  Object.keys(map).map((k, i) => {
    if (map[k] !== null) {
      lastRightSideMatch = map[k]
      return
    }

    if (i === 0) {
      map[k] = '0'
      lastRightSideMatch = map[k]
      changes.push({ type: 'change', index: parseInt(k), value: arr2[map[k]] })
      return
    }

    if (lastRightSideMatch === null) return

    if (Object.values(map).includes(`${parseInt(lastRightSideMatch) + 1}`)) return
    map[k] = `${parseInt(lastRightSideMatch) + 1}`

    lastRightSideMatch = map[k]
    changes.push({ type: 'change', index: parseInt(k), value: arr2[map[k]] })
  })

  Object.keys(map).map(k => {
    if (map[k] !== null) return

    changes.push({ type: 'deletion', index: parseInt(k) })
  })

  return changes
}