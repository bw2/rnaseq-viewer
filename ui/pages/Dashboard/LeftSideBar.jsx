import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { getAllSamplesByCategory, getSelectedSampleIds } from 'redux/selectors'


class LeftSideBar extends React.Component
{
  static propTypes = {
    currentLocus: PropTypes.string,
    referenceGenome: PropTypes.string,
    samplesByCategory: PropTypes.object,
    selectedSampleIds: PropTypes.array,
    updateCurrentLocus: PropTypes.func,
    updateSelectedSampleIds: PropTypes.func,
  }

  render() {
    console.log('samplesByCategory', this.props.samplesByCategory)

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
          Object.entries(this.props.samplesByCategory).map(
            ([categoryName, samples]) =>
              <div key={categoryName}>
                <br />
                <h3> {categoryName.toUpperCase()} </h3>
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
})


export { LeftSideBar as LeftSideBarComponent }

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideBar)
