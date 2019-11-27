import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import IGV from '../components/IGV'
import { getSelectedSamplesList } from '../redux/selectors'

class IGVPanel extends React.Component
{
  static propTypes = {
    referenceGenome: PropTypes.string,
    locus: PropTypes.string,
    options: PropTypes.object,
    selectedSamplesList: PropTypes.array,
    updateLocus: PropTypes.func,
  }

  render() {
    const igvTracks = []

    this.props.selectedSamplesList.forEach((sample) => {

      if (sample.coverage && sample.junctions) {
        //docs @ https://github.com/igvteam/igv.js/wiki/Wig-Track
        console.log(`Adding ${sample.coverage} and ${sample.junctions} track`)

        igvTracks.push({
          type: 'merged',
          name: sample.label,
          height: 100,
          tracks: [
            {
              type: 'wig',
              format: 'bigwig',
              url: sample.coverage,
              oauthToken: IGVPanel.getOauthTokenFn,
            },
            {
              type: 'junctions',
              format: 'bed',
              url: sample.junctions,
              indexURL: `${sample.junctions}.tbi`,
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
      if (this.props.options.showBams && sample.bam) {
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
      locus: this.props.locus || 'ACTA1',
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

    return <IGV igvOptions={igvOptions} locusChangedHandler={evt => this.props.updateLocus(evt.label.replace(',', ''))} />
  }
}


const mapDispatchToProps = dispatch => ({
  updateLocus: (newLocus) => {
    dispatch({
      type: 'UPDATE_LOCUS',
      newValue: newLocus,
    })
  },
})

const mapStateToProps = state => ({
  referenceGenome: state.referenceGenome,
  locus: state.locus,
  options: state.options,
  selectedSamplesList: getSelectedSamplesList(state),
})

export { IGVPanel as IGVPanelComponent }

export default connect(mapStateToProps, mapDispatchToProps)(IGVPanel)
