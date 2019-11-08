import { combineReducers } from 'redux'
import { SubmissionError } from 'redux-form'

import { reducers as dashboardReducers } from 'pages/Dashboard/reducers'
import { HttpRequestHelper } from 'shared/utils/httpRequestHelper'
import {
  createObjectsByIdReducer,
  createSingleObjectReducer,
} from './utils/reducerFactories'
import modalReducers from './utils/modalReducer'

/**
 * Action creator and reducers in one file as suggested by https://github.com/erikras/ducks-modular-redux
 */

// actions
export const RECEIVE_DATA = 'RECEIVE_DATA'
const REQUEST_GENES = 'REQUEST_GENES'
const UPDATE_CONFIG = 'UPDATE_CONFIG'
const UPDATE_LOCI = 'UPDATE_LOCI'

// action creators

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


export const loadGenes = (geneIds) => {
  return (dispatch, getState) => {
    const state = getState()
    if ([...geneIds].some(geneId => !state.genesById[geneId])) {
      dispatch({ type: REQUEST_GENES })
      new HttpRequestHelper('/api/genes_info',
        (responseJson) => {
          dispatch({ type: RECEIVE_DATA, updatesById: responseJson })
        },
        (e) => {
          dispatch({ type: RECEIVE_DATA, error: e.message, updatesById: {} })
        },
      ).get({ geneIds: [...geneIds] })
    }
  }
}

export const updateConfig = updates => ({ type: UPDATE_CONFIG, updates })


// root reducer
const rootReducer = combineReducers(Object.assign({
  loci: createObjectsByIdReducer(UPDATE_LOCI),
  data: createSingleObjectReducer(UPDATE_CONFIG),
}, modalReducers, dashboardReducers))

export default rootReducer
