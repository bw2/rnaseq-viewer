import { createSelector } from 'reselect'

export const getCurrentLocus = state => state.locus
export const getSamplesInfo = state => state.samplesInfo
export const getSelectedSampleIds = state => state.selectedSampleIds

/**
 * Expects sample info like:
 *
 * [
 *    {
 *      label: 'category1',
 *      samples : [
 *          { sample1 .. },
 *          { sample2 .. },
 *          ...
 *      ]
 *    },
 *    {
 *      label: 'category2',
 *      samples : [
 *        { sample3 .. },
 *        { sample4 .. },
 *        ...
 *      ]
 *    },
 * ]
 */

export const getSelectedSamplesList = createSelector(
  getSamplesInfo,
  getSelectedSampleIds,
  (samplesInfo, selectedSampleIds) => samplesInfo.map(category => category.samples).flat().filter(s => selectedSampleIds.includes(s.label)),
)
