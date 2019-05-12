import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Top from './components/Top';
import Chat from './components/Chat';
import Login from './Auth/Login';
import Logout from './Auth/Logout';

import './App.css';

import isAuthenticated from './Auth/isAuthenticated';

const App = () => (
  <div>
    <Header isAuthenticated={isAuthenticated()} />
    <main>
      <Switch>
        <Route exact path="/" component={Top} />
        <Route path="/chat" component={Chat} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        }}/>
      </Switch>
    </main>
  </div>
)


export default App;
