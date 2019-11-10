import React from 'react'
import PropTypes from 'prop-types'
import { sortBy } from 'lodash'
import { Checkbox } from 'semantic-ui-react'
import { connect } from 'react-redux'


class LeftSideBar extends React.Component
{
  static propTypes = {
    data: PropTypes.object,
    selectedSamples: PropTypes.object,
    onCheckboxChange: PropTypes.func,
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
                      <Checkbox label={sample.label} checked={(this.props.selectedSamples[sample.label] || {}).checked} onChange={this.props.onCheckboxChange} />
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
  onCheckboxChange: (e, data) => {
    dispatch({
      type: 'UPDATE_SELECTED_SAMPLES',
      updatesById: { [data.label]: { checked: data.checked || false } },
    })
  },

})


export { LeftSideBar as LeftSideBarComponent }

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideBar)
