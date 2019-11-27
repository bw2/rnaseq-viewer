import React from 'react'
import PropTypes from 'prop-types'
import styled from "styled-components"
import { Checkbox, Icon, Popup } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { getSamplesInfo, getSelectedSampleNames } from '../redux/selectors'


const CategoryH3 = styled.h3` 
  display: inline-block;
  margin: 12px 0px 0px 0px !important;
`
const CategoryDetails = styled.div`
  display: inline-block;
  margin: 0px 0px 0px 30px;
  color: gray;
  whiteSpace: 'nowrap';
`

const OptionsPanel = ({options, updateOptions}) =>
  <div>
    <Checkbox label="show BAMs" checked={options.showBams} onChange={(e, data) => updateOptions({ showBams: data.checked })} />
  </div>


const CategoryPanel = ({category}) =>
  <div>
    <CategoryH3>{category.name.toUpperCase()}</CategoryH3>
    {
      category.samples.length >= 10 && <CategoryDetails>{`(N=${category.samples.length}) `}</CategoryDetails>
    }
  </div>


const SamplesPanel = ({samplesInfo, selectedSampleNames, updateSelectedSampleNames}) =>
  samplesInfo.map(category =>
    <div key={category.name}>
      <CategoryPanel category={category} />
      {
        category.samples.map(sample =>
          <SamplePanel key={sample.name} sample={sample} selectedSampleNames={selectedSampleNames} updateSelectedSampleNames={updateSelectedSampleNames}/>
        )
      }
    </div>,
  )

const SamplePanel = ({sample, selectedSampleNames, updateSelectedSampleNames}) =>
  <div>
    <Checkbox
      label={sample.name}
      checked={selectedSampleNames.includes(sample.name)}
      onChange={(e, data) =>
        updateSelectedSampleNames(
          data.checked ? [...selectedSampleNames, data.label] : selectedSampleNames.filter(x => x !== data.label),
        )
      }
    />
    <SampleDetails sample={sample} />
  </div>

const SampleDetails = ({sample}) => {
  return (sample.description ? <Popup content={sample.description} trigger={
    <Icon style={{marginLeft: '10px'}} name="question circle outline" />
  } /> : null)
}



class LeftSideBar extends React.Component
{
  static propTypes = {
    options: PropTypes.object,
    samplesInfo: PropTypes.array,
    selectedSampleNames: PropTypes.array,
    updateOptions: PropTypes.func,
    updateSelectedSampleNames: PropTypes.func,
  }

  render() {
    //const params = new URLSearchParams(window.location.search)
    return (
      <div>

        <OptionsPanel
          options={this.props.options}
          updateOptions={this.props.updateOptions}
        />

        <SamplesPanel
          samplesInfo={this.props.samplesInfo}
          selectedSampleNames={this.props.selectedSampleNames}
          updateSelectedSampleNames={this.props.updateSelectedSampleNames}
        />

      </div>)
  }
}

const mapStateToProps = state => ({
  options: state.options,
  selectedSampleNames: getSelectedSampleNames(state),
  samplesInfo: getSamplesInfo(state),
})

const mapDispatchToProps = dispatch => ({
  updateSelectedSampleNames: (selectedSampleNames) => {
    dispatch({
      type: 'UPDATE_SELECTED_SAMPLES',
      newValue: selectedSampleNames,
    })
  },
  updateOptions: (newSettings) => {
    dispatch({
      type: 'UPDATE_OPTIONS',
      updates: newSettings,
    })
  },
})


export { LeftSideBar as LeftSideBarComponent }

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideBar)
