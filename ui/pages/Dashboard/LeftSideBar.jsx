import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { getAllSamplesByCategory, getSelectedSampleIds } from 'redux/selectors'


class LeftSideBar extends React.Component
{
  static propTypes = {
    currentLocus: PropTypes.string,
    displaySettings: PropTypes.object,
    samplesByCategory: PropTypes.object,
    selectedSampleIds: PropTypes.array,
    updateCurrentLocus: PropTypes.func,
    updateDisplaySettings: PropTypes.func,
    updateSelectedSampleIds: PropTypes.func,
  }

  render() {
    console.log('samplesByCategory', this.props.samplesByCategory)

    //const params = new URLSearchParams(window.location.search)
    return (
      <ul>
        <h3> LOCUS </h3>

        <Input type="text" placeholder="Gene or region" defaultValue={this.props.currentLocus} onKeyUp={(e) => {
          if (e.keyCode === 13) {
            this.props.updateCurrentLocus(e.target.value)
          }
        }}
        />

        <h3> DISPLAY </h3>
        <Checkbox
          label="show BAMs"
          checked={this.props.displaySettings.showBams}
          onChange={(e, data) => this.props.updateDisplaySettings({ showBams: data.checked })}
        />

        {
          Object.entries(this.props.samplesByCategory).map(
            ([categoryName, samples]) =>
              <div key={categoryName}>
                <br />
                <div>
                  <h3 style={{ display: 'inline-block' }}> {categoryName.toUpperCase()} </h3>
                  <div style={{ display: 'inline-block', margin: '0px 0px 0px 8px', color: 'gray', whiteSpace: 'nowrap' }}>(N={samples.length})</div>
                </div>
                {
                  samples.map(sample =>
                    <div key={sample.label}>
                      <Checkbox
                        label={sample.label}
                        checked={this.props.selectedSampleIds.includes(sample.label)}
                        onChange={(e, data) =>
                          this.props.updateSelectedSampleIds(
                            data.checked ? [...this.props.selectedSampleIds, data.label] : this.props.selectedSampleIds.filter(x => x !== data.label),
                          )
                        }
                      />
                      {
                        sample.description && <div style={{ margin: '0px 0px 10px 25px', color: 'gray', whiteSpace: 'nowrap' }}>({sample.description})</div>
                      }
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
  displaySettings: state.displaySettings,
  selectedSampleIds: getSelectedSampleIds(state),
  samplesByCategory: getAllSamplesByCategory(state),
})

const mapDispatchToProps = dispatch => ({
  updateCurrentLocus: (newLocus) => {
    dispatch({
      type: 'UPDATE_CURRENT_LOCUS',
      newValue: newLocus,
    })
  },
  updateSelectedSampleIds: (selectedSampleIds) => {
    dispatch({
      type: 'UPDATE_SELECTED_SAMPLES',
      newValue: selectedSampleIds,
    })
  },
  updateDisplaySettings: (newSettings) => {
    dispatch({
      type: 'UPDATE_DISPLAY_SETTINGS',
      updates: newSettings,
    })
  },
})


export { LeftSideBar as LeftSideBarComponent }

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideBar)
