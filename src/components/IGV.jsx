import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import igv from 'igv'

const StyledDiv = styled.div`  
`

const debounced = (delay, fn) => {
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
    igvOptions: PropTypes.object.isRequired,
    locusChangedHandler: PropTypes.func,
    trackRemovedHandler: PropTypes.func,
  }

  constructor(props) {
    super(props)
    console.log('IGV.constructor', props)
    this.container = null
    this.browser = null
  }

  setContainerElement = (element) => {
    this.container = element
  }

  render = () => <StyledDiv><div ref={this.setContainerElement} /></StyledDiv>

  componentDidMount() {
    console.log('IGV.componentDidMount', this.props)
    if (this.container) {
      if (this.props.igvOptions.googleOauthToken) {
        igv.setGoogleOauthToken(this.props.igvOptions.googleOauthToken)
      }
      igv.createBrowser(this.container, this.props.igvOptions).then((browser) => {
        this.browser = browser

        if (this.props.locusChangedHandler) {
          this.browser.on('locuschange', debounced(300, this.props.locusChangedHandler)) //{chr, start, end, label}
        }

        if (this.props.trackRemovedHandler) {
          this.browser.on('trackremoved', this.props.trackRemovedHandler)
        }
      })
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    console.log('IGV.shouldComponentUpdate', nextProps, nextState)
    return false
  }

  componentDidUpdate(prevProps) {
    console.log('IGV.componentDidUpdate', prevProps)
    if (this.browser && prevProps.igvOptions.tracks !== this.props.igvOptions.tracks) {
      console.log('IGV.componentDidUpdate tracks changed')
      this.props.igvOptions.tracks.forEach((track) => {
        this.browser.loadTrack(track)
      })
    }
  }
}

export default IGV
