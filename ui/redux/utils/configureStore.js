import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import jsurl from 'jsurl'

import { loadState, saveState } from 'shared/utils/localStorage'


const env = process.env.NODE_ENV || 'development'
console.log('ENV: ', env)

const PERSISTING_STATE = [
  'currentLocus', 'selectedSampleIds',
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
  applyMiddleware(thunkMiddleware, persistStoreMiddleware, logger),
)


/**
 * Initialize the Redux store
 * @param rootReducer
 * @param initialState
 * @returns {*}
 */
export const configureStore = (
  rootReducer = state => state,
  initialState = {},
) => {

  //restore any values from local storage
  PERSISTING_STATE.forEach((key) => { initialState[key] = loadState(key) })

  //values from url override values from local storage
  initialState = { ...initialState, ...jsurl.parse(window.location.hash.replace(/^#/, '')) }

  console.log('Creating store with initial state:')
  console.log(initialState)

  return createStore(rootReducer, initialState, enhancer)
}
