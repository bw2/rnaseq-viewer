import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import igv from 'igv'
import { connect } from 'react-redux'

import { getGenome, getLocus, getTracks } from '../redux/selectors'

const IGV_SETTINGS = {
  showKaryo: false,
  showIdeogram: false,
  showNavigation: true,
  showRuler: true,
  showCenterGuide: true,
  showCursorTrackingGuide: true,
  showCommandBar: true,
}

const StyledDiv = styled.div``

const throttle = (delay, fn) => {
  let timerId
  return (...args) => {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fn(...args)
      timerId = null
    }, delay)
  }
}

class IGV extends React.Component {

  static propTypes = {
    genome: PropTypes.string.isRequired,
    locus: PropTypes.string.isRequired,
    tracks: PropTypes.array.isRequired,
    locusChangedHandler: PropTypes.func,
    trackRemovedHandler: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.container = null
    this.browser = null
  }

  setContainerElement = (element) => {
    this.container = element
  }

  render = () => <StyledDiv><div ref={this.setContainerElement} /></StyledDiv>

  componentDidMount() {

    if (!this.container) {
      return
    }

    let options = {
      ...IGV_SETTINGS,
      locus: this.props.locus,
      genome: this.props.genome,
      tracks: this.props.tracks,
    }

    igv.createBrowser(this.container, options).then((browser) => {
      this.browser = browser

      if (this.props.locusChangedHandler) {
        this.browser.on('locuschange', throttle(300, this.props.locusChangedHandler)) //{chr, start, end, label}
      }

      if (this.props.trackRemovedHandler) {
        this.browser.on('trackremoved', this.props.trackRemovedHandler)
      }
    })
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (!this.container) {
      return false
    }

    console.log('IGV.shouldComponentUpdate', nextProps, nextState)
    let tracksToAdd = nextProps.tracks.reduce((acc, item) => {
      return {[item.name]: item, ...acc}
    }, {})

    for (let track of this.props.tracks) {
      if (tracksToAdd[track.name]) {
        delete tracksToAdd[track.name]
      } else {
        try {
          this.browser.removeTrackByName(track.name)
        } catch(e) {
          console.warn('Unable to remove track', track.name, e)
        }
      }
    }

    for (let track of Object.values(tracksToAdd)) {
      try {
        this.browser.loadTrack(track)
      } catch(e) {
        console.warn('Unable to add track', track.name, e)
      }
    }

    return false
  }
}


const mapDispatchToProps = dispatch => ({
  locusChangedHandler: (event) => {
    const newLocus = event.label.replace(/,/g, '')

    dispatch({
      type: 'UPDATE_LOCUS',
      newValue: newLocus,
    })
  },
  /*
  trackRemovedHandler: (track) => {
    const trackName = track.name
    dispatch({
      type: 'UPDATE_SELECTED_SAMPLES',
      newValue: selectedSampleNames,
    })
  },
  */
})

const mapStateToProps = state => ({
  genome: getGenome(state),
  locus: getLocus(state),
  tracks: getTracks(state),
})

export { IGV as IGVComponent }

export default connect(mapStateToProps, mapDispatchToProps)(IGV)

