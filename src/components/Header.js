import React from 'react';
import { Link } from 'react-router-dom';

const Header = (props) => (
  <header>
    <h1>GraphQL Chat Header</h1>
    <nav>
      <ul>
        <li><Link to='/'>Top</Link></li>
        <li><Link to='/chat'>Chat</Link></li>
        {
          !props.isAuthenticated ? (
            <li><Link to='/login'>Login</Link></li>
          ) : (
            <li><Link to='/logout'>Logout</Link></li>
          )
        }
      </ul>
    </nav>
  </header>
)

export default Header;
