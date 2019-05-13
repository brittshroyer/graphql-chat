import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Top from './components/Top';
import Chat from './components/Chat';
import NotFound from './components/NotFound';
import Login from './Auth/Login';
import Logout from './Auth/Logout';

import './App.css';

const App = () => (
  <div>
    <main>
      <Switch>
        <Route exact path="/" component={Top} />
        <Route path="/chat" component={Chat} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route component={NotFound} />
      </Switch>
    </main>
  </div>
)


export default App;
