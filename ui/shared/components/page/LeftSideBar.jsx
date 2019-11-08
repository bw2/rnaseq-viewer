import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getData } from 'redux/selectors'

//import styled from 'styled-components'
//import { Link } from 'react-router-dom'

/*
const HeaderMenu = styled(Menu)`
  padding-left: 100px;
  padding-right: 100px;
`
 */

class LeftSideBar extends React.Component
{
  static propTypes = {
    data: PropTypes.object,
  }

  render() {
    console.log('---------')
    console.log(this.props.data)
    return (
      <ul>{
        Object.keys(this.props.data).map(
          key => <li key={key}> {key} </li>,
        )
      }
      </ul>)
  }
}

const mapStateToProps = state => ({
  data: getData(state),
})

export { LeftSideBar as LeftSideBarComponent }

export default connect(mapStateToProps)(LeftSideBar)
