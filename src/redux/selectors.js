import { createSelector } from 'reselect'

export const getCurrentLocus = state => state.locus
export const getSamplesInfo = state => state.samplesInfo
export const getSelectedSampleNames = state => state.selectedSampleNames

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
  getSelectedSampleNames,
  (samplesInfo, selectedSampleNames) => samplesInfo.map(category => category.samples).flat().filter(s => selectedSampleNames.includes(s.label)),
)
