import React from 'react';

import './Chatbox.css';

const Chatbox = ({message}) => (
  <div className="chat-box">
    <div className="chat-message">
      <h5>{message.sentBy}</h5>
      <p>
        {message.content}
      </p>
      <p>
        {message.createdAt}
      </p>
    </div>
  </div>
);

export default Chatbox;
