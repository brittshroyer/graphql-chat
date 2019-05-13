import React from 'react';
import { Link } from 'react-router-dom';


const Header = (props) => {
  let username = props.username || 'friend';
  return (
    <header>
      <h1>Welcome {username}!</h1>
      <nav>
        <ul>
          <li><Link to='/'>Top</Link></li>
          <li><Link to='/chat'>Chat</Link></li>
          <li><Link to='/logout'>Logout</Link></li>
        </ul>
      </nav>
    </header>
  )

}


export default Header;
