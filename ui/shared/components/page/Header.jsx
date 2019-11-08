import React from 'react'
import styled from 'styled-components'

import { Menu, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import AwesomeBar from './AwesomeBar'

const HeaderMenu = styled(Menu)`
  padding-left: 100px;
  padding-right: 100px;
`

const PageHeader = () =>
  <HeaderMenu borderless inverted attached>
    <Menu.Item as={Link} to="/"><Header size="medium" inverted>RNA-seq</Header></Menu.Item>
    <Menu.Item key="awesomebar" fitted="vertically"><AwesomeBar newWindow inputwidth="350px" /></Menu.Item>,
  </HeaderMenu>

export { PageHeader as PageHeaderComponent }

export default PageHeader
