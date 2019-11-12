/**
 * Top-level page layout that consists of the standard seqr header and footer, with arbitrary
 * content in-between.
 */

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Grid } from 'semantic-ui-react'

import Header from './Header'


const LayoutContainer = styled.div`
  height: calc(100% - 32px);
`

const ContentGrid = styled(Grid)`
  padding-top: 15px !important;
  min-height: calc(100% - 46px);
  align-content: flex-start;
`

const BaseLayout = ({ children }) =>
  <LayoutContainer>
    <Header />
    <ContentGrid>
      <Grid.Row>
        <Grid.Column width={16}>
          {children}
        </Grid.Column>
      </Grid.Row>
    </ContentGrid>
  </LayoutContainer>

export { BaseLayout as BaseLayoutComponent }

BaseLayout.propTypes = {
  children: PropTypes.node,
}

export default BaseLayout
