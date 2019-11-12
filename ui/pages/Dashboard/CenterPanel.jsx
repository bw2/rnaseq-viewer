import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { SashimiPlot } from 'shared/components/sashimi/SashimiPlot'
import { sortBy } from 'lodash'


const coverageString = `chr1    14810   14812   90
chr1    14812   14813   87
chr1    14813   14814   88
chr1    14814   14815   90
chr1    14815   14818   92
chr1    14818   14819   95
chr1    14819   14820   94
chr1    14820   14821   96
chr1    14821   14822   95
chr1    14822   14823   90
chr1    14823   14824   91
chr1    14824   14826   90
chr1    14826   14827   93
chr1    14827   14829   99
chr1    14829   14835   6
chr1    14835   14846   5
chr1    14846   14848   4
chr1    14848   14852   3
chr1    14852   14867   2
chr1    14867   14881   1
chr1    14881   14887   0
chr1    14887   14929   1
chr1    14929   14939   2
chr1    14939   14951   1
chr1    14951   14963   2
chr1    14963   14964   1
chr1    14964   14969   3
chr1    14969   14970   99
chr1    14970   14971   98
chr1    14971   14972   95
chr1    14972   14973   97
chr1    14973   14974   101
chr1    14974   14975   103
chr1    14975   14976   102
chr1    14976   14977   96
chr1    14977   14978   98
chr1    14978   14980   100
chr1    14980   14981   102
chr1    14981   14982   104
chr1    14982   14983   108
chr1    14983   14984   107
chr1    14984   14988   114
chr1    14988   14993   113
chr1    14993   14995   114
chr1    14995   14998   113
chr1    14998   14999   108`

const coverageData = coverageString.split('\n').map((row) => {
  const r = row.split(/[\s]+/)
  return [parseInt(r[1], 10), parseInt(r[2], 10), Math.floor(parseFloat(r[3]))]
})


const junctionString = `chr1    14830   14929   2       2       1       1       1       10
chr1    14830   14969   2       2       1       15      462     38
chr1    14830   15795   2       2       1       0       12      21
chr1    15039   15795   2       2       1       8       155     37`

const junctionData = junctionString.split('\n').map((row) => {
  const r = row.split(/[\s]+/)
  return [parseInt(r[1], 10), parseInt(r[2], 10), Math.floor(parseFloat(r[7]))]
})

class CenterPanel extends React.Component
{
  static propTypes = {
    samplesInfo: PropTypes.object,
    selectedSampleIds: PropTypes.array,
  }

  render = () =>
    <div>
      {
        Object.entries(this.props.samplesInfo).map(
          ([categoryName, samples]) =>
            <div key={categoryName}>
              {
                sortBy(Object.values(samples).filter(s => this.props.selectedSampleIds.includes(s.label)), ['order', 'label']).map(
                  sample =>
                    <SashimiPlot
                      key={sample.label}
                      title={sample.label}
                      width={1200}
                      height={300}
                      coverageColor="#001DAF"
                      coverageData={coverageData}
                      junctionData={junctionData}
                      info={sample}
                    />,
                )
              }
            </div>,
        )
      }
    </div>
}

const mapStateToProps = state => ({
  samplesInfo: state.samplesInfo,
  selectedSampleIds: state.selectedSampleIds,
})

export { CenterPanel as CenterPanelComponent }

export default connect(mapStateToProps)(CenterPanel)
