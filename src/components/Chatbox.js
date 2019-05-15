import React from 'react';
import moment from 'moment';

import './Chatbox.css';

const Chatbox = ({message, isOwnMessage}) => {
  let textAlign = isOwnMessage ? 'right' : 'left';
  let name = isOwnMessage ? 'You' : message.sentBy.name;

  let { createdAt } = message;

  createdAt = moment(createdAt).format('LLL');

  let chatColor = isOwnMessage ? '#3FB1DE' : '#999999';

  // TODO: Build dynamic time stamp functionality

  // let withinTheHour = moment(createdAt).isAfter(moment().subtract(1, 'hours'));
  // let withinTheDay = moment(createdAt).isAfter(moment().subtract(1, 'day'));
  // let withinTheMinute = moment(createdAt).isAfter(moment().subtract(1, 'minute'));
  //
  // if (withinTheMinute) {
  //   createdAt = 'Just now';
  // } else if (withinTheHour) {
  //   createdAt = moment(createdAt).startOf('hour').fromNow();
  // } else if (withinTheDay) {
  //   createdAt = moment(createdAt).format('LT');
  // } else {
  //   createdAt = moment(createdAt).format('LLL');
  // }


  return (
    <div style={{textAlign}}>
      <p className="chat-message" style={{background: chatColor}}>
        <span className="chat-content">{message.content}</span>
      </p>
      <p className="sub-text">{name} - {createdAt}</p>
    </div>
  );
};

export default Chatbox;
