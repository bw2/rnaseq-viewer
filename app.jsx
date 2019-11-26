import 'react-hot-loader/patch'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'

import BaseLayout from 'components/BaseLayout'
import rootReducer from 'redux/rootReducer'
import { configureStore } from 'redux/configureStore'

import 'semantic-ui-css/semantic-custom.css'

ReactDOM.render(
  <Provider store={configureStore(rootReducer)}>
    <AppContainer>
      <BaseLayout />
    </AppContainer>
  </Provider>,
  document.getElementById('reactjs-root'),
)
