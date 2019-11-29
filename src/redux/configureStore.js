import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import jsurl from 'jsurl'

import { loadState, saveState } from '../utils/localStorage'

const INITIAL_STATE = {
  genome: 'hg38',
  locus: 'chr15:12345-54321',
  options: {},
  samplesInfo: window.INITIAL_TRACKS || [],
}

const PERSISTING_STATE = [
  'options', 'locus', 'selectedSampleNames',
]

const persistStoreMiddleware = store => next => (action) => {
  const result = next(action)
  const nextState = store.getState()
  PERSISTING_STATE.forEach((key) => { saveState(key, nextState[key]) })

  const stateToSave = Object.keys(nextState)
    .filter(key => PERSISTING_STATE.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: nextState[key],
      }
    }, {})

  window.location.hash = `#${jsurl.stringify(stateToSave)}`

  return result
}

const enhancer = compose(
  applyMiddleware(thunkMiddleware, persistStoreMiddleware),
)


/**
 * Initialize the Redux store
 * @param rootReducer
 * @param initialState
 * @returns {*}
 */
export const configureStore = (
  rootReducer = state => state,
  initialState = INITIAL_STATE,
) => {

  //restore any values from local storage
  PERSISTING_STATE.forEach((key) => {
    const v = loadState(key)
    if (v !== undefined) {
      initialState[key] = v
    }
  })

  //values from url override values from local storage
  initialState = { ...initialState, ...jsurl.parse(window.location.hash.replace(/^#/, '')) }

  console.log('Initializing store to:', initialState)

  return createStore(rootReducer, initialState, enhancer)
}
