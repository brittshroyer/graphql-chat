import React from 'react';
import { Link } from 'react-router-dom';
import './Top.css';

const Top = () => (
  <div className="login-landing">
    <h2>GraphQL Chat</h2>
    <li><Link to='/chat'>Enter</Link></li>
  </div>
)

export default Top;
