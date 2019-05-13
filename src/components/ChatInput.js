import React from 'react'

const ChatInput = (props) => {
  return (
    <div className='ChatInput'>
      <input
        placeholder='Enter your message...'
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
