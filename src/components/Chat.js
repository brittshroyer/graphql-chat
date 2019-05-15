import React, { Component } from 'react';

import { graphql, compose } from 'react-apollo';

import { MESSAGES_SUBSCRIPTION, ALL_MESSAGES_QUERY  } from '../graphql/queries';
import { CREATE_MESSAGE_MUTATION  } from '../graphql/mutations';

import Chatbox from './Chatbox';
// import UserCount from './UserCount';
import ChatInput from './ChatInput';

// import Header from './Header';

import './Chat.css';


class Chat extends Component {

  state = {
    content: '',
    loading: true
  };

  componentDidMount() {
    this._subscribeToNewMessages();
  }

  // Scroll last message into view
  componentDidUpdate(prevProps) {
    if (prevProps.allMessagesQuery.allMessages !== this.props.allMessagesQuery.allMessages && this.endRef) {
      this.endRef.scrollIntoView();
    }
  }

  render() {
    const allMessages = this.props.allMessagesQuery.allMessages || [];
    const chatComponent = this.state.loading ? <p>Loading</p> : allMessages.map(message => {
      const isOwnMessage = message.sentBy.id === this.props.user;
      return (
        <Chatbox
          key={message.id}
          message={message}
          isOwnMessage={isOwnMessage}
          />
      );
    });


    return (
      <div className="chat-container">
        <header className="chat-header">
          <h2>Messages</h2>
          <h6>Active Users: </h6>
        </header>
        <section className="chats">
          {chatComponent}
          <span className="chatbox-bottom" ref={el => this._endRef(el)}></span>
        </section>
        <ChatInput
          message={this.state.content}
          onTextInput={(content) => this.setState({content})}
          onResetText={() => this.setState({content: ''})}
          onSend={this._createMessage}
        />
      </div>
    );
  }

  _createMessage = () => {
    const { content } = this.state;

    if (!content) {
      return;
    }

    this.props.createMessageMutation({
      variables: {
        content: content,
        sentById: this.props.user
      }
    });
  };

  _endRef = (element) => {
    this.endRef = element;
  };

  _subscribeToNewMessages = () => {
    this.props.allMessagesQuery.subscribeToMore({
      document: MESSAGES_SUBSCRIPTION,
      updateQuery: (previousState, { subscriptionData }) => {
        const newMessage = subscriptionData.data.Message.node
        const messages = previousState ? previousState.allMessages.concat([newMessage]) : [];
        return {
          allMessages: messages,
        }
      },
      onError: err => console.error(err)
    });
    this.setState({loading: false});
  };
}

export default compose(
  graphql(ALL_MESSAGES_QUERY, { name: 'allMessagesQuery' }),
  graphql(CREATE_MESSAGE_MUTATION, { name: 'createMessageMutation' })
)(Chat);
