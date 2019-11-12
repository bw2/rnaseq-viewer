import React from 'react'
import { Grid } from 'semantic-ui-react'
import DocumentTitle from 'react-document-title'
import LeftSideBar from './LeftSideBar'
import CenterPanel from './CenterPanel'
import IGVPanel from './IGVPanel'

export default () => (
  <div>
    <DocumentTitle title="RNA-seq Viewer" />
    <Grid>
      <Grid.Row>
        <Grid.Column width={2}>
          <LeftSideBar />
        </Grid.Column>
        <Grid.Column width={13}>
          <IGVPanel />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
)
