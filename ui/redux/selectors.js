import { sortBy } from 'lodash'
import { createSelector } from 'reselect'

export const getCurrentLocus = state => state.currentLocus
export const getSamplesInfo = state => state.samplesInfo
export const getSelectedSampleIds = state => state.selectedSampleIds

/**
 * Returns:
 *
 * {
 *    category1 : [
 *      { sample1 .. },
 *      { sample2 .. },
 *      ...
 *    ],
 *    category2 : [
 *      { sample3 .. },
 *      { sample4 .. },
 *      ...
 *    ],
 *  }
 *
 */

/* eslint-disable no-unused-vars */
export const getAllSamplesByCategory = createSelector(
  getSamplesInfo,
  samplesInfo => Object.entries(samplesInfo).reduce(
    (acc, [categoryName, samples]) => ({
      ...acc,
      ...{
        [categoryName]:
          sortBy(Object.entries(samples), [([_, sample]) => sample.order, ([_, sample]) => sample.label]).map(
            ([sampleId, sample]) => ({
              ...sample,
              categoryName,
              sampleId,
              label: sample.label || sampleId,
            })),
      },
    }), {}),
)

export const getSelectedSamplesList = createSelector(
  getAllSamplesByCategory,
  getSelectedSampleIds,
  (samplesByCategory, selectedSampleIds) => Object.values(samplesByCategory).flat().filter(s => selectedSampleIds.includes(s.label)),
)
