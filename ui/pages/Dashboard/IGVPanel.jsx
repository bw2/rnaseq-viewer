import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import IGV from 'shared/components/graph/IGV'
import { getSelectedSamplesList } from 'redux/selectors'

class IGVPanel extends React.Component
{
  static propTypes = {
    referenceGenome: PropTypes.string,
    currentLocus: PropTypes.string,
    displaySettings: PropTypes.object,
    selectedSamplesList: PropTypes.array,
  }

  static getOauthTokenFn = () => {
    return fetch('/api/google_auth_token').then(response => response.json()).then(j => j.auth_token)
  }

  render() {
    const igvTracks = []

    this.props.selectedSamplesList.forEach((sample) => {

      if (sample.coverage_bigWig && sample.spliceJunctions_bed) {
        //docs @ https://github.com/igvteam/igv.js/wiki/Wig-Track
        console.log(`Adding ${sample.coverage_bigWig} and ${sample.spliceJunctions_bed} track`)

        igvTracks.push({
          type: 'merged',
          name: sample.label,
          height: 100,
          tracks: [
            {
              type: 'wig',
              format: 'bigwig',
              url: sample.coverage_bigWig,
              oauthToken: IGVPanel.getOauthTokenFn,
            },
            {
              type: 'junctions',
              format: 'bed',
              url: sample.spliceJunctions_bed,
              indexURL: `${sample.spliceJunctions_bed}.tbi`,
              displayMode: 'EXPANDED',
              oauthToken: IGVPanel.getOauthTokenFn,
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
          oauthToken: IGVPanel.getOauthTokenFn,
          name: sample.label,
          displayMode: 'SQUISHED',
        })
      }
      */
      if (this.props.displaySettings.showBams && sample.bam) {
        //docs @ https://github.com/igvteam/igv.js/wiki/Alignment-Track
        console.log(`Adding ${sample.bam} track`)

        igvTracks.push({
          type: 'alignment',
          url: sample.bam,
          oauthToken: IGVPanel.getOauthTokenFn,
          name: sample.label,
          alignmentShading: 'strand',
          showSoftClips: true,
          //...trackOptions,
        })
      }
    })

    console.log('igvTracks', igvTracks)

    const igvOptions = {
      locus: this.props.currentLocus || 'ACTA1',
      tracks: igvTracks,
      genome: `hg${this.props.referenceGenome}`,
      showKaryo: false,
      showIdeogram: false,
      showNavigation: true,
      showRuler: true,
      showCenterGuide: true,
      showCursorTrackingGuide: true,
      showCommandBar: true,
    }

    return <IGV igvOptions={igvOptions} />
  }

}

const mapStateToProps = state => ({
  referenceGenome: state.referenceGenome,
  currentLocus: state.currentLocus,
  displaySettings: state.displaySettings,
  selectedSamplesList: getSelectedSamplesList(state),
})

export { IGVPanel as IGVPanelComponent }

export default connect(mapStateToProps)(IGVPanel)
