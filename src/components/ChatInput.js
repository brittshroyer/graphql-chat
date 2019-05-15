import React from 'react';

// import Textarea from 'react-textarea-autosize';

const ChatInput = (props) => {
  return (
    <div>
      <input
        className='chat-input'
        placeholder='Send a message'
        type='text'
        value={props.message}
        autoFocus={true}
        onChange={e => props.onTextInput(e.target.value)}
        onKeyDown={e => {
          if (e.keyCode === 13) { // ENTER
            props.onSend();
            props.onResetText();
          }
        }}
      />
    </div>
  )
};

export default ChatInput;
