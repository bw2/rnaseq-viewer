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
  margin: 0px 0px 0px 15px;
  color: #999;
  whiteSpace: 'nowrap';
`

const OptionDiv = styled.div`
  padding-top:3px;
`

const OptionsPanel = ({options, updateOptions}) =>
  <div>
    <CategoryH3>JUNCTION TRACK FILTERS</CategoryH3><br />
    <OptionDiv>Uniquely-mapped reads:</OptionDiv><input type="text" id="minUniquelyMappedReads" defaultValue="0" />
    <OptionDiv>Total reads:</OptionDiv>
    <input type="text" id="minTotalReads" defaultValue="1" />
    <OptionDiv>Fraction multi-mapped:<br/>
      <span style={{fontSize: '9px'}}>1 - (uniquely-mapped / total read count)</span>
    </OptionDiv><input type="text" id="maxFractionMultiMappedReads" defaultValue="1" />
    <OptionDiv>Splice overhang base-pairs:</OptionDiv><input type="text" id="minSplicedAlignmentOverhang" defaultValue="0" />
    <OptionDiv>Donor/Acceptor Motifs:</OptionDiv>
    {
      ['GT/AG', 'CT/AC', 'GC/AG', 'CT/GC', 'AT/AC', 'GT/AT', 'non-canonical'].map(motif =>
        <OptionDiv key={motif}><label><Checkbox type="checkbox" id="hideAnnotatedJunctions" /> Hide {motif}</label></OptionDiv>
      )
    }
    <CategoryH3>JUNCTION TRACK VIEW OPTIONS</CategoryH3><br />
    <OptionDiv>
      <label>
      <Checkbox type="checkbox" id="hideCoverage" checked={options.hideCoverage} onChange={(e, data) => updateOptions({ hideCoverage: data.checked })} /> Hide coverage
      </label>
    </OptionDiv>
    <OptionDiv><label><Checkbox type="checkbox" id="hideAnnotatedJunctions" /> Hide known junctions</label></OptionDiv>
    <OptionDiv><label><Checkbox type="checkbox" id="hideUnannotatedJunctions" /> Hide novel junctions</label></OptionDiv>

    <OptionDiv>Color by:</OptionDiv>
    <OptionDiv>
      <select id="colorBy" name="colorBy">
        <option value="strand">strand</option>
        <option value="motif">donor/acceptor motif</option>
        <option value="numUniqueReads"># uniquely-mapped reads</option>
        <option value="numReads"># total reads</option>
        <option value="isAnnotatedJunction">is known junction</option>
      </select>
    </OptionDiv>
    <OptionDiv>Junction thickness:</OptionDiv>
    <OptionDiv>
      <select id="thicknessBasedOn" name="thicknessBasedOn">
        <option value="numUniqueReads"># uniquely-mapped reads</option>
        <option value="numReads"># total reads</option>
        <option value="isAnnotatedJunction">is known junction</option>
      </select>
    </OptionDiv>
    <OptionDiv>Junction bounce height:</OptionDiv>
    <OptionDiv>
      <select id="bounceHeightBasedOn" name="bounceHeightBasedOn">
        <option value="random">random</option>
        <option value="distance">distance</option>
        <option value="thickness">thickness</option>
      </select>
    </OptionDiv>
    <OptionDiv>Include in label: </OptionDiv>
    <OptionDiv><label><Checkbox type="checkbox" id="hideAnnotatedJunctions" /> uniquely-mapped reads</label></OptionDiv>
    <OptionDiv><label><Checkbox type="checkbox" id="hideAnnotatedJunctions" /> multi-mapped reads</label></OptionDiv>
    <OptionDiv><label><Checkbox type="checkbox" id="hideAnnotatedJunctions" /> total reads</label></OptionDiv>
    <OptionDiv><label><Checkbox type="checkbox" id="hideAnnotatedJunctions" /> donor/acceptor motif</label></OptionDiv>
    <OptionDiv><label><Checkbox type="checkbox" id="hideAnnotatedJunctions" /> is known junction</label></OptionDiv>
    <OptionDiv>known junction symbol:</OptionDiv>
    <input type="text" id="labelIsAnnotatedJunction" defaultValue="[A]" />
  </div>


class RightSideBar extends React.Component
{
  static propTypes = {
    options: PropTypes.object,
    samplesInfo: PropTypes.array,
    selectedSampleNames: PropTypes.array,
    updateOptions: PropTypes.func,
    updateSelectedSampleNames: PropTypes.func,
  }

  render() {
    return <OptionsPanel
      options={this.props.options}
      updateOptions={this.props.updateOptions}
    />
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


export { RightSideBar as RightSideBarComponent }

export default connect(mapStateToProps, mapDispatchToProps)(RightSideBar)
