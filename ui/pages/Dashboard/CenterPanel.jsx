import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getData } from 'redux/selectors'
import IGV from 'shared/components/graph/IGV'

class CenterPanel extends React.Component
{
  static propTypes = {
    data: PropTypes.object,
  }


  render() {
    console.log(this.props.data)
    const url = '/api/project/' //${sample.projectGuid}/igv_track/${encodeURIComponent(sample.datasetFilePath)}`

    const igvTracks = [{
      url,
      name: 'track1',
      alignmentShading: 'strand',
      type: 'alignment',
      showSoftClips: true,
      //...trackOptions,
    }]

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

    const genome = '38' // '37'
    const locus = 'chr1:50000-51000'

    igvTracks.push({
      url: `https://storage.googleapis.com/seqr-reference-data/GRCh${genome}/gencode/gencode.v27${genome === '37' && 'lift37'}.annotation.sorted.gtf.gz`,
      name: `gencode hg${genome}v27`,
      displayMode: 'SQUISHED',
    })

    const igvOptions = {
      locus,
      tracks: igvTracks,
      genome: `hg${genome}`,
      showKaryo: false,
      showIdeogram: true,
      showNavigation: true,
      showRuler: true,
      showCenterGuide: true,
      showCursorTrackingGuide: true,
      showCommandBar: true,
    }

    return (
      <IGV igvOptions={igvOptions} />
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state),
})

export { CenterPanel as CenterPanelComponent }

export default connect(mapStateToProps)(CenterPanel)
