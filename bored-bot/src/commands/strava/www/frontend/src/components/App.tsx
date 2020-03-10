import {Route, Switch} from 'react-router-dom'

import Accept from './Accept'
import Home from './Home'
import React from 'react'

export default () => 
  <Switch>
    <Route exact path='/' component={Home}/>
    <Route exact path='/accept' component={Accept}/>
  </Switch>