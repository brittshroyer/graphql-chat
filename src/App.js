import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Top from './components/Top';
// import Chat from './components/Chat';
import Map from './components/Map';
import NotFound from './components/NotFound';
import Login from './Auth/Login';
import Logout from './Auth/Logout';

import './App.css';

const App = () => (
  <div>
    <main className="main-container">
      <Switch>
        <Route exact path="/" component={Top} />
        <Route path="/chat" component={() => <Map name={localStorage.getItem('world_chat_username')} />} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route component={NotFound} />
      </Switch>
    </main>
  </div>
)


export default App;
