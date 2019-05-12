import React, { Component } from 'react';

import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import Chatbox from './Chatbox';

import { Redirect } from 'react-router-dom';
import isAuthenticated from '../Auth/isAuthenticated';

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      from: 'anonymous',
      content: ''
    };
  }


  _createChat = async e => {
    if (e.key === 'Enter') {
      const { content, from } = this.state;
      await this.props.createChatMutation({
        variables: { content, from }
      });
      this.setState({ content: '' });
    }
  };

  componentDidMount() {
    // Get username from prompt
    // when page loads
    const from = window.prompt('username');
    from && this.setState({ from });
  }

  render() {
    const allChats = this.props.allChatsQuery.allChats || [];

    return isAuthenticated() ? (



        <div className="container">
          <h2>Chats</h2>
          {allChats.map(message => (
            <Chatbox key={message.id} message={message} />
          ))}
          <input
            value={this.state.content}
            onChange={e => this.setState({ content: e.target.value })}
            type="text"
            placeholder="Start typing"
            onKeyPress={this._createChat}
          />
        </div>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: this.props.location }
      }} />
    )
  }
}

const ALL_CHATS_QUERY = gql`
  query AllChatsQuery {
    allChats {
      id
      createdAt
      from
      content
    }
  }
`;

const CREATE_CHAT_MUTATION = gql`
  mutation CreateChatMutation($content: String!, $from: String!) {
    createChat(content: $content, from: $from) {
      id
      createdAt
      from
      content
    }
  }
`;

export default compose(
  graphql(ALL_CHATS_QUERY, { name: 'allChatsQuery' }),
  graphql(CREATE_CHAT_MUTATION, { name: 'createChatMutation' })
)(Chat);
