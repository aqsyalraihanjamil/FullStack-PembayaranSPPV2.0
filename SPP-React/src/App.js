import React, { Component } from 'react'
import {Switch, Route} from "react-router-dom"
import Home from './pages/Home'
import Login from "./pages/Login"
import LoginEz from './pages/LoginEz'
import Register from './pages/Register'

export default class App extends Component {
  
  render() {
    return (
      <div>
        <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
        <Route path="/log" component={LoginEz}/>
        </Switch>
      </div>
    )
  }
}
