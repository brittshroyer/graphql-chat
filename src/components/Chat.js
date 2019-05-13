import React, { Component } from 'react';

import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import Chatbox from './Chatbox';
import Header from './Header';


import { Redirect } from 'react-router-dom';
import isAuthenticated from '../Auth/isAuthenticated';

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      from: 'anonymous',
      content: '',
      typing: false
    };
  }

  onType = (content) => {
    let typing = content.length > 0;
    this.setState({ content, typing });
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

  _subscribeToNewChats = () => {
    this.props.allChatsQuery.subscribeToMore({
      document: gql`
        subscription {
          Chat(filter: { mutation_in: [CREATED] }) {
            node {
              id
              from
              content
              createdAt
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const newChatLinks = [
          ...previous.allChats,
          subscriptionData.data.Chat.node
        ];
        const result = {
          ...previous,
          allChats: newChatLinks
        };
        return result;
      }
    });
  };

  componentDidMount() {
    let username = localStorage.chat_username;

    if (!username) {
      username = window.prompt('username');
    }
    this._subscribeToNewChats();
    this.setState({ from: username });
  }

  render() {
    const allChats = this.props.allChatsQuery.allChats || [];

    return isAuthenticated() ? (
        <div className="container">
          <Header username={this.state.from}/>
          <h2>Chats</h2>
          <section className="chats">
            {allChats.map(message => (
              <Chatbox key={message.id} message={message} />
            ))}
          </section>
          <input
            value={this.state.content}
            onChange={e => this.onType(e.target.value)}
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
