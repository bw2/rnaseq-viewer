import React from 'react'
import { Grid } from 'semantic-ui-react'
import LeftSideBar from './LeftSideBar'
import IGVPanel from './IGVPanel'

export default () => (
  <div>
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
