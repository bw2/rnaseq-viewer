import { orderBy } from 'lodash'
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
  samplesInfo => orderBy(Object.entries(samplesInfo), [([categoryName, samples]) => categoryName], ['desc']).reduce(
    (acc, [categoryName, samples]) => ({
      ...acc,
      ...{
        [categoryName]:
          orderBy(
            Object.entries(samples).map(
              ([sampleId, sample]) => ({
                ...sample,
                categoryName,
                sampleId,
                label: sample.label || sampleId,
              })),
            ['order', 'label'],
          ),
      },
    }), {}),
)

export const getSelectedSamplesList = createSelector(
  getAllSamplesByCategory,
  getSelectedSampleIds,
  (samplesByCategory, selectedSampleIds) => Object.values(samplesByCategory).flat().filter(s => selectedSampleIds.includes(s.label)),
)
