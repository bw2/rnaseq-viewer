import { combineReducers } from 'redux'

import {
  zeroActionsReducer,
  createSingleValueReducer,
  createSingleObjectReducer,
} from './utils/reducerFactories'


// root reducer
const rootReducer = combineReducers(Object.assign({
  //loci: createObjectsByIdReducer('UPDATE_LOCI'),
  referenceGenome: zeroActionsReducer,
  locus: createSingleValueReducer('UPDATE_LOCUS', ''),
  options: createSingleObjectReducer('UPDATE_OPTIONS'),
  samplesInfo: zeroActionsReducer,
  selectedSampleIds: createSingleValueReducer('UPDATE_SELECTED_SAMPLES', []),
}))

export default rootReducer
