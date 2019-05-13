import React from 'react';
import { Link } from 'react-router-dom';


const Top = () => (
  <div>
    <h2>GraphQL Chat</h2>
    <li><Link to='/login'>Login</Link></li>
    <li><Link to='/chat'>Chat</Link></li>
  </div>
)

export default Top;
