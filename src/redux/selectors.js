import { createSelector } from 'reselect'
import { getGoogleAccessToken } from '../utils/googleAuth'

export const getOptions = state => state.options
export const getLocus = state => state.locus
export const getGenome = state => state.genome
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

export const getSelectedSamples = createSelector(
  getSamplesInfo,
  getSelectedSampleNames,
  (samplesInfo, selectedSampleNames) => samplesInfo.map(category => category.samples).flat().filter(s => selectedSampleNames.includes(s.name)),
)


export const getTracks = createSelector(
  getSelectedSamples,
  getOptions,
  (selectedSamples, options) => {
    const igvTracks = []

    selectedSamples.forEach((sample) => {
      if (sample.coverage && sample.junctions) {
        //docs @ https://github.com/igvteam/igv.js/wiki/Wig-Track

        igvTracks.push({
          type: 'merged',
          name: sample.name,
          height: 100,
          tracks: [
            {
              type: 'wig',
              format: 'bigwig',
              url: sample.coverage,
              oauthToken: getGoogleAccessToken,
            },
            {
              type: 'junctions',
              format: 'bed',
              url: sample.junctions,
              indexURL: `${sample.junctions}.tbi`,
              oauthToken: getGoogleAccessToken,
              minUniquelyMappedReads: 1,
              minTotalReads: 1,
              maxFractionMultiMappedReads: 1,
              minSplicedAlignmentOverhang: 0,
              thicknessBasedOn: 'numUniqueReads', //options: numUniqueReads (default), numReads, isAnnotatedJunction
              bounceHeightBasedOn: 'random', //options: random (default), distance, thickness
              colorBy: 'isAnnotatedJunction', //options: numUniqueReads (default), numReads, isAnnotatedJunction, strand, motif
              labelUniqueReadCount: true,
              labelMultiMappedReadCount: true,
              labelTotalReadCount: false,
              labelMotif: false,
              labelIsAnnotatedJunction: " [A]",
              hideAnnotatedJunctions: false,
              hideUnannotatedJunctions: false,
              hideMotifs: ['GT/AT', 'non-canonical'], //options: 'GT/AG', 'CT/AC', 'GC/AG', 'CT/GC', 'AT/AC', 'GT/AT', 'non-canonical'
            },
          ],
        })
      }
      /*
      if (sample.vcf) {
        //docs @ https://github.com/igvteam/igv.js/wiki/Alignment-Track
        console.log(`Adding ${sample.vcf} track`)

        igvTracks.push({
          type: 'variant',
          format: 'vcf',
          url: sample.vcf,
          indexUrl: `${sample.vcf}.tbi`,
          oauthToken: getGoogleAccessToken,
          name: sample.name,
          displayMode: 'SQUISHED',
        })
      }
      */
      if (options.showBams && sample.bam) {
        //docs @ https://github.com/igvteam/igv.js/wiki/Alignment-Track
        console.log(`Adding ${sample.bam} track`)

        igvTracks.push({
          type: 'alignment',
          url: sample.bam,
          name: `${sample.name} bam`,
          alignmentShading: 'strand',
          showSoftClips: true,
          oauthToken: getGoogleAccessToken,
          //...trackOptions,
        })
      }
    })

    return igvTracks
  }
)
