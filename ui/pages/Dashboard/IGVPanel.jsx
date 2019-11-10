import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import IGV from 'shared/components/graph/IGV'
import { sortBy } from 'lodash'

class IGVPanel extends React.Component
{
  static propTypes = {
    referenceGenome: PropTypes.string,
    currentLocus: PropTypes.string,
    samplesInfo: PropTypes.object,
    selectedSamples: PropTypes.array,
    googleOauthToken: PropTypes.string,
  }

  render() {
    if (!this.props.currentLocus) {
      return null
    }

    const igvTracks = []

    Object.entries(this.props.samplesInfo).forEach(
      ([categoryName, samples]) => { //eslint-disable-line no-unused-vars
        sortBy(Object.values(samples), ['order', 'label']).filter(s => this.props.selectedSamples.includes(s.label)).forEach(
          (sample) => {
            /*
            if (sample.bam) {
              //docs @ https://github.com/igvteam/igv.js/wiki/Alignment-Track
              igvTracks.push({
                type: 'alignment',
                url: sample.bam,
                name: sample.label,
                alignmentShading: 'strand',
                showSoftClips: true,
                //...trackOptions,
              })
            }
            */

            if (sample.coverage) {
              //docs @ https://github.com/igvteam/igv.js/wiki/Wig-Track
              console.log(`Adding ${sample.coverage} track`)
              igvTracks.push({
                type: 'wig',
                url: sample.coverage,
                name: sample.label,
                color: 'blue',
                //...trackOptions,
              })
            }
          })
      },
    )
    /*

     */
    /*
    let trackOptions = BAM_TRACK_OPTIONS
    if (sample.datasetFilePath.endsWith('.cram')) {
      if (sample.datasetFilePath.startsWith('gs://')) {
        trackOptions = {
          format: 'cram',
          indexURL: `${url}.crai`,
        }
      } else {
        trackOptions = CRAM_PROXY_TRACK_OPTIONS
      }
    }
    */

    //const trackName = ReactDOMServer.renderToString(
    //  <span><PedigreeIcon sex={individual.sex} affected={individual.affected} />{individual.displayName}</span>,
    //)

    /*
    igvTracks.push({
      type: 'annotation',
      format: 'gtf',
      url: `https://storage.googleapis.com/seqr-reference-data/GRCh${this.props.referenceGenome}/gencode/gencode.v27${(this.props.referenceGenome === '37' && 'lift37') || ''}.annotation.sorted.gtf.gz`,
      indexURL: `https://storage.googleapis.com/seqr-reference-data/GRCh${this.props.referenceGenome}/gencode/gencode.v27${(this.props.referenceGenome === '37' && 'lift37') || ''}.annotation.sorted.gtf.gz.tbi`,
      name: `gencode hg${this.props.referenceGenome}v27`,
      displayMode: 'SQUISHED',
    })

    */
    const igvOptions = {
      locus: this.props.currentLocus,
      tracks: igvTracks,
      genome: `hg${this.props.referenceGenome}`,
      showKaryo: false,
      showIdeogram: false,
      showNavigation: true,
      showRuler: true,
      showCenterGuide: true,
      showCursorTrackingGuide: true,
      showCommandBar: true,
      googleOauthToken: this.props.googleOauthToken,
    }

    return <IGV igvOptions={igvOptions} />
  }

}

const mapStateToProps = state => ({
  referenceGenome: state.referenceGenome,
  currentLocus: state.currentLocus,
  samplesInfo: state.samplesInfo,
  selectedSamples: state.selectedSamples,
  googleOauthToken: state.googleOauthToken,
})

export { IGVPanel as IGVPanelComponent }

export default connect(mapStateToProps)(IGVPanel)
