import React from 'react'
import PropTypes from 'prop-types'
import { sortBy } from 'lodash'
import { Checkbox, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'


class LeftSideBar extends React.Component
{
  static propTypes = {
    currentLocus: PropTypes.string,
    referenceGenome: PropTypes.string,
    samplesInfo: PropTypes.object,
    selectedSamples: PropTypes.array,
    updateCurrentLocus: PropTypes.func,
    updateSelectedSamples: PropTypes.func,

  }

  render() {

    //const params = new URLSearchParams(window.location.search)
    return (
      <ul>
        <div style={{ display: 'flex' }}>
          <h3> LOCUS </h3>
          <div style={{ margin: '0px 0px 10px 30px', color: 'gray', whiteSpace: 'nowrap' }}>(genome: hg{this.props.referenceGenome})</div>
        </div>

        <Input type="text" placeholder="Gene or region" defaultValue={this.props.currentLocus} onKeyUp={(e) => {
          if (e.keyCode === 13) {
            this.props.updateCurrentLocus(e.target.value)
          }
        }}
        />
        {
          Object.entries(this.props.samplesInfo).map(
            ([categoryName, samples]) =>
              <div key={categoryName}>
                <br />
                <h3> {categoryName.toUpperCase()} </h3>
                {
                  sortBy(Object.values(samples), ['order', 'label']).map(
                    sample =>
                      <div key={sample.label}>
                        <Checkbox
                          label={sample.label}
                          checked={this.props.selectedSamples.includes(sample.label)}
                          onChange={(e, data) =>
                            this.props.updateSelectedSamples(
                              data.checked ? [...this.props.selectedSamples, data.label] : this.props.selectedSamples.filter(x => x !== data.label),
                            )
                          }
                        />
                      </div>,
                  )
                }
              </div>,
          )
        }
      </ul>)
  }
}

const mapStateToProps = state => ({
  currentLocus: state.currentLocus,
  referenceGenome: state.referenceGenome,
  samplesInfo: state.samplesInfo,
  selectedSamples: state.selectedSamples,
})

const mapDispatchToProps = dispatch => ({
  updateCurrentLocus: (newLocus) => {
    dispatch({
      type: 'UPDATE_CURRENT_LOCUS',
      newValue: newLocus,
    })
  },
  updateSelectedSamples: (selectedSamples) => {
    dispatch({
      type: 'UPDATE_SELECTED_SAMPLES',
      newValue: selectedSamples,
    })
  },
})


export { LeftSideBar as LeftSideBarComponent }

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideBar)
