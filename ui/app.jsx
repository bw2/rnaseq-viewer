import 'react-hot-loader/patch'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import BaseLayout from 'shared/components/page/BaseLayout'
import Dashboard from 'pages/Dashboard/Dashboard'
import rootReducer from 'redux/rootReducer'
import { configureStore } from 'redux/utils/configureStore'

import 'semantic-ui-css/semantic-custom.css'
import 'shared/global.css'

ReactDOM.render(
  <Provider store={configureStore(rootReducer, window.initialJSON)}>
    <AppContainer>
      <BrowserRouter>
        <BaseLayout>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route component={() => <div>Invalid URL</div>} />
          </Switch>
        </BaseLayout>
      </BrowserRouter>
    </AppContainer>
  </Provider>,
  document.getElementById('reactjs-root'),
)
