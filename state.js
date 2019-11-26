/**
 * Utilities for keeping GLOBAL_PROPERTIES in sync with localStore and the url hash.
 */

let GLOBAL_PROPERTIES = {
  'locus': 'chr15:92835700-93031800',
  'tracks': '',
}

const initGlobalProperties = () => {
  // get properties from localStorage
  const propertiesFromLocalStore = Object.keys(GLOBAL_PROPERTIES).reduce((result, key) => {
    const value = localStorage.getItem(key)
    if (value !== null) {
      result[key] = value
    }
    return result
  }, {})

  // get properties from url hash
  const hash = window.location.hash.substr(1)
  const propertiesFromUrl = hash.split('&').reduce((result, item) => {
    if (item) {
      const [key, value] = item.split('=')
      result[decodeURIComponent(key)] = decodeURIComponent(value)
    }
    return result
  }, {})

  GLOBAL_PROPERTIES = {...GLOBAL_PROPERTIES, ...propertiesFromLocalStore, ...propertiesFromUrl}

  updateUrlHash()

  console.log('GLOBAL_PROPERTIES:', GLOBAL_PROPERTIES)
}


const updateUrlHash = () => {
  const updatedUrlHash = Object.entries(GLOBAL_PROPERTIES).map(
    ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  ).join('&')

  window.location.hash = updatedUrlHash
}

const getGlobalProperty = key => GLOBAL_PROPERTIES[key]

const setGlobalProperty = (key, value) => {
  localStorage.setItem(key, value)

  //update url hash
  GLOBAL_PROPERTIES[key] = value

  updateUrlHash()
}

const getLocus = () => getGlobalProperty('locus')

const updateLocus = (locus) => {
  setGlobalProperty('locus', locus)
}

const getTrackList = () => {
    return GLOBAL_PROPERTIES.tracks ? GLOBAL_PROPERTIES.tracks.split(',') : []
}

const isTrackShown = (name) => {
  return getTrackList().indexOf(name) !== -1
}

const updateTrack = (name, isSelected) => {
  let trackList = getTrackList()
  if (isSelected) {
    trackList.push(name)
  } else {
    trackList = trackList.filter(item => item !== name)
  }

  setGlobalProperty('tracks', trackList.join(','))
}
