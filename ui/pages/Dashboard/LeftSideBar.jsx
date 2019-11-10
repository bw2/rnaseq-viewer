import React from 'react'
import PropTypes from 'prop-types'
import { sortBy } from 'lodash'
import { Checkbox } from 'semantic-ui-react'
import { connect } from 'react-redux'


class LeftSideBar extends React.Component
{
  static propTypes = {
    data: PropTypes.object,
    selectedSamples: PropTypes.array,
    updateSelectedSamples: PropTypes.func,
  }

  render() {

    //const params = new URLSearchParams(window.location.search)
    return (
      <ul>{
        Object.entries(this.props.data).map(
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
  data: state.data,
  selectedSamples: state.selectedSamples,
})

const mapDispatchToProps = dispatch => ({
  updateSelectedSamples: (selectedSamples) => {
    dispatch({
      type: 'UPDATE_SELECTED_SAMPLES',
      newValue: selectedSamples,
    })
  },
})


export { LeftSideBar as LeftSideBarComponent }

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideBar)
