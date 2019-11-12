import { combineReducers } from 'redux'
import { SubmissionError } from 'redux-form'

import { HttpRequestHelper } from 'shared/utils/httpRequestHelper'
import {
  zeroActionsReducer,
  createSingleValueReducer,
  createObjectsByIdReducer,
  createSingleObjectReducer,
} from './utils/reducerFactories'

import modalReducers from './utils/modalReducer'


// A helper action that handles create, update and delete requests
export const updateEntity = (values, receiveDataAction, urlPath, idField, actionSuffix, getUrlPath) => {
  return (dispatch, getState) => {
    if (getUrlPath) {
      urlPath = getUrlPath(getState())
    }

    let action = 'create'
    if (values[idField]) {
      urlPath = `${urlPath}/${values[idField]}`
      action = values.delete ? 'delete' : 'update'
    }

    return new HttpRequestHelper(`${urlPath}/${action}${actionSuffix || ''}`,
      (responseJson) => {
        dispatch({ type: receiveDataAction, updatesById: responseJson })
      },
      (e) => {
        throw new SubmissionError({ _error: [e.message] })
      },
    ).post(values)
  }
}

// root reducer
const rootReducer = combineReducers(Object.assign({
  referenceGenome: zeroActionsReducer,
  loci: createObjectsByIdReducer('UPDATE_LOCI'),
  currentLocus: createSingleValueReducer('UPDATE_CURRENT_LOCUS', ''),
  displaySettings: createSingleObjectReducer('UPDATE_DISPLAY_SETTINGS'),
  samplesInfo: zeroActionsReducer,
  selectedSampleIds: createSingleValueReducer('UPDATE_SELECTED_SAMPLES', []),
}, modalReducers))

export default rootReducer
