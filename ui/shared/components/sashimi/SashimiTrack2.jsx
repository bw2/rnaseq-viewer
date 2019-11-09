/* eslint-disable no-shadow */
import PropTypes from 'prop-types'
import React from 'react'

import { area, line, curveCatmullRom } from 'd3-shape'
import { range } from 'd3-array'
import { path } from 'd3-path'
import { scaleLinear } from 'd3-scale'
import {RegionViewer} from "./RegionViewer";


export const SashimiTrack = ({
                               title,
                               width,
                               height,
                               coverageColor,
                               coverage,
                               junctions,
                             }) => {
  console.log('title', title)
  console.log('width', width)
  console.log('height', height)
  console.log('coverageColor', coverageColor)
  console.log(coverage)
  console.log(junctions)

  //const coverageArea = area()
  //  .x(base => base.scaledPosition)
  //  .y0(_ => height)  // eslint-disable-line
  //  .y1(base => yScale(base.reading))

  const sashimiJunctionPath = (junction) => {
    const sashimiJunctionLine = line()
      .defined((junction) => {
        return junction.xpos !== undefined
      })
      .x((junction) => {
        return junction.xpos
      })
      .y(junction => yScale(junction.ypos))
      .curve(curveCatmullRom.alpha(1))

    const [start, mid1, mid2, stop] = junction.positions

    return (
      <g>
        <path
          key={`${junction.series}-${start.xpos}-${stop.xpos}-${junction.reading}`}
          d={sashimiJunctionLine(junction.positions)}
          fill="none"
          stroke={coverageColour}
          strokeWidth={4}
        />
        <rect
          x={mid1.xpos + 25}
          y={yScale(mid1.ypos + 60)}
          width={50}
          fill="white"
          height={30}
          strokeWidth={1}
          stroke="white"
        />
        <text
          x={mid1.xpos + 50}
          y={yScale(mid1.ypos)}
          style={{ textAnchor: 'middle' }}
        >
          {junction.reading}
        </text>
      </g>
    )
  }

  //const junctionPaths = calculateJunctionPositions(junctions).map(junction => sashimiJunctionPath(junction))

  const x0_pixel = 50
  const y0_pixel = height - 30

  const start_0based = Math.min(...coverage.map(r => r[0]))
  const end_1based = Math.max(...coverage.map(r => r[1]))

  const maxCoverage = Math.max(...coverage.map(r => r[2]))
  const numCoverageTicks = 10
  const stepCoverageAxis = (Math.ceil(maxCoverage/10)*10)/numCoverageTicks
  const coverageToPixel = scaleLinear()
    .domain([0, maxCoverage])
    .range([y0_pixel, 0])

  const numPosTicks = 7
  const stepPosAxis = (Math.ceil((end_1based - start_0based)/10)*10)/numPosTicks
  const posToPixel = scaleLinear()
    .domain([start_0based, end_1based])
    .range([x0_pixel, width])

  //const [min, max] = xScale.range()
  return (
    <svg width={width} height={height}>

      {/* draw y-axis */}
      <text styles={{fontSize: '12px', textAnchor: 'middle'}} x={x0_pixel - 45} y={height/2} transform={`rotate(270 10 ${height / 2})`}>{title}</text>
      <g>
        {range(stepCoverageAxis, maxCoverage, stepCoverageAxis).map((cov) => {
            const y_pixel = coverageToPixel(cov)
            return <g key={cov}>
              <line x1={x0_pixel - 5} x2={x0_pixel} y1={y_pixel} y2={y_pixel} stroke="black" strokeWidth={1} />
              <text styles={{fontSize: '8px', textAnchor: 'end'}} x={x0_pixel - 35} y={y_pixel + 3}>{Math.floor(cov)}</text>
            </g>
          },
        )}
      </g>

      {/* draw x-axis */}
      <line x1={x0_pixel} x2={width} y1={y0_pixel} y2={y0_pixel} stroke="black" strokeWidth={1}/>
      {range(start_0based, end_1based, stepPosAxis).map((pos) => {
          const x_pixel = posToPixel(pos)
          return <g key={pos}>
            <line x1={x_pixel} x2={x_pixel} y1={y0_pixel + 5} y2={y0_pixel} stroke="black" strokeWidth={1} />
            <text styles={{fontSize: '8px', textAnchor: 'end'}} x={x_pixel - 25} y={y0_pixel + 25}>{Math.floor(pos)}</text>
          </g>
        },
      )}

      {/* draw coverage */}
      {area().x(base => base.scaledPosition).y0(_ => height).y1(base => yScale(base.reading))}

    </svg>
  )
  /*
  <g>
        <path
          d={coverageArea(scaleCoverage(xScale, coverage))}
          fill={coverageColor}
        />
        {junctionPaths}
      </g>
   */
}

SashimiTrack.propTypes = {
  title: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number, // eslint-disable-line
  coverageColor: PropTypes.string,
  axisColor: PropTypes.string,
  coverage: PropTypes.array.isRequired,
  junctions: PropTypes.array.isRequired,
}

RegionViewer.defaultProps = {
  coverageColor: "blue",
  axisColor: "gray",
}


export default SashimiTrack
