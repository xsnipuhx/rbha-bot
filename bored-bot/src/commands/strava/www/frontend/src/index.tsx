import App from './components/App'
import { HashRouter } from 'react-router-dom'
// index.tsx
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <HashRouter>
    <App/>
  </HashRouter>,
  document.getElementById('root'),
)