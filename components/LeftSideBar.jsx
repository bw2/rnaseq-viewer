import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, Icon, Popup } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { getSamplesInfo, getSelectedSampleIds } from 'redux/selectors'


class LeftSideBar extends React.Component
{
  static propTypes = {
    displaySettings: PropTypes.object,
    samplesInfo: PropTypes.array,
    selectedSampleIds: PropTypes.array,
    updateDisplaySettings: PropTypes.func,
    updateSelectedSampleIds: PropTypes.func,
  }

  render() {
    console.log('samplesInfo', this.props.samplesInfo)

    //const params = new URLSearchParams(window.location.search)
    return (
      <ul>
        <h3> DISPLAY </h3>
        <Checkbox
          label="show BAMs"
          checked={this.props.displaySettings.showBams}
          onChange={(e, data) => this.props.updateDisplaySettings({ showBams: data.checked })}
        />

        {
          this.props.samplesInfo.map(category =>
            <div key={category.name}>
              <br />
              <div>
                <h3 style={{ display: 'inline-block' }}> {category.name.toUpperCase()} </h3>
                <div style={{ display: 'inline-block', margin: '0px 0px 0px 8px', color: 'gray', whiteSpace: 'nowrap' }}>(N={category.samples.length})</div>
              </div>
              {
                category.samples.map(sample =>
                  <div key={sample.name}>
                    <Checkbox
                      label={sample.name}
                      checked={this.props.selectedSampleIds.includes(sample.name)}
                      onChange={(e, data) =>
                        this.props.updateSelectedSampleIds(
                          data.checked ? [...this.props.selectedSampleIds, data.label] : this.props.selectedSampleIds.filter(x => x !== data.label),
                        )
                      }
                    />
                    {
                      sample.description && <Popup content={sample.description} trigger={<Icon name="question circle outline" />} />
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
  displaySettings: state.displaySettings,
  selectedSampleIds: getSelectedSampleIds(state),
  samplesInfo: getSamplesInfo(state),
})

const mapDispatchToProps = dispatch => ({
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
