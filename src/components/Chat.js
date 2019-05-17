import React, { Component } from 'react';

import { graphql, compose } from 'react-apollo';

import { MESSAGES_SUBSCRIPTION, ALL_MESSAGES_QUERY, ACTIVE_USERS_SUBSCRIPTION, ACTIVE_USERS_QUERY  } from '../graphql/queries';
import { CREATE_MESSAGE_MUTATION  } from '../graphql/mutations';

import Chatbox from './Chatbox';
import ChatInput from './ChatInput';

import './Chat.css';


class Chat extends Component {

  state = {
    content: '',
    loading: true,
    activeUsers: []
  };

  // componentWillReceiveProps(nextProps) {
  //   console.log('willReceiveProps', nextProps);
  // }


  componentDidMount() {
    this._subscribeToNewMessages();
    this.props.map.props.client.query({
      query: ACTIVE_USERS_QUERY,
      variables: {
        active: true
      }
    }).then(result => {
      let currentState = this.state.activeUsers.slice();
      this.setState({ activeUsers: currentState.concat(result.data.allUsers) });
    });

    this._subscribeToActiveUsers();

    // this.setState({ activeUsers: activeUsers.data.allUsers }, () => {
    //   let usersSubscription = await this._subscribeToActiveUsers();
    // });
  }

  // Scroll last message into view
  componentDidUpdate(prevProps) {
    if (prevProps.allMessagesQuery.allMessages !== this.props.allMessagesQuery.allMessages && this.endRef) {
      this.endRef.scrollIntoView();
    }
  }

  render() {
    const allMessages = this.props.allMessagesQuery.allMessages || [];
    // const activeUsers = this.props.activeUsersQuery.allUsers || [];
    // console.log('activeUsers', activeUsers);
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
          <h6>Active Users: {this.state.activeUsers.length}</h6>
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
          allMessages: messages
        }
      },
      onError: err => console.error(err)
    });
    this.setState({loading: false});
  };

  _subscribeToActiveUsers = () => {
    // console.log('subscribe', this.props);
    this.props.activeUsersQuery.subscribeToMore({
      document: ACTIVE_USERS_SUBSCRIPTION,
      variables: {active: true},
      updateQuery: (previousState, { subscriptionData }) => {
        const modifiedUser = subscriptionData.data.User.node;
        console.log('modifiedUser', modifiedUser);
        const activeUsers = previousState ? previousState.allUsers.concat([modifiedUser]) : [modifiedUser];
        this.setState({ activeUsers });
        return {
          allUsers: activeUsers
        };
      },
      onError: err => console.error(err)
    });
  };

}

export default compose(
  graphql(ALL_MESSAGES_QUERY, { name: 'allMessagesQuery' }),
  graphql(CREATE_MESSAGE_MUTATION, { name: 'createMessageMutation' }),
  graphql(ACTIVE_USERS_QUERY, { name: 'activeUsersQuery' })
)(Chat);
