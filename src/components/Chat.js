import React, { Component } from 'react';

import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import Chatbox from './Chatbox';
import UserCount from './UserCount';
import ChatInput from './ChatInput';
// import Header from './Header';


import { Redirect } from 'react-router-dom';
import isAuthenticated from '../Auth/isAuthenticated';

const ALL_MESSAGES_QUERY = gql`
  query allMessages {
    allMessages {
      id
      content
      createdAt
      sentBy {
        id
        name
      }
    }
  }
`;

const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage($content: String!, $sentById: ID!) {
    createMessage(content: $content, sentById: $sentById) {
      id
      content
      createdAt
      sentBy {
        id
        name
      }
    }
  }
`;

const ALL_LOCATIONS_QUERY = gql`
  query allLocations {
    allLocations {
      id
      latitude
      longitude
      user {
        id
        name
      }
    }
  }
`;

const CREATE_LOCATION_AND_USER_MUTATION = gql`
  mutation createLocationAndUser($name: String!, $latitude: Float!, $longitude: Float!) {
    createLocation(latitude: $latitude, longitude: $longitude, user: { name: $name }) {
      id
      latitude
      longitude
      user {
        id
        name
      }
    }
  }
`;

const UPDATE_LOCATION_MUTATION = gql`
  mutation updateLocation($locationId: ID!, $latitude: Float!, $longitude: Float!) {
    updateLocation(id: $locationId, latitude: $latitude, longitude: $longitude) {
      user {
        id
        name
      }
      id
      latitude
      longitude
    }
  }
`;

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: localStorage.getItem('world_chat_username'),
      content: ''
    };
  }

  _createMessage = async e => {
    this.props.createMessageMutation({
      variables: {
        content: this.state.content,
        sentById: this.props.UserId
      }
    });

  };

  _subscribeToLocationUpdates = () => {
    this.props.allLocationsQuery.subscribeToMore({
      document: gql`
        subscription {
          Location(
            filter: {
              OR: [
                { mutation_in: [CREATED] }
                { AND: [{ mutation_in: [UPDATED] }, { updatedFields_contains_some: ["latitude", "longitude"] }] }
              ]
            }
          ) {
            mutation
            node {
              id
              latitude
              longitude
              user {
                id
                name
              }
            }
          }
        }
      `,
      updateQuery: (previousState, { subscriptionData }) => {
        if (subscriptionData.data.Location.mutation === 'CREATED') {
          const newLocation = subscriptionData.data.Location.node
          const locations = previousState.allLocations.concat([newLocation])
          return {
            allLocations: locations,
          }
        } else if (subscriptionData.data.Location.mutation === 'UPDATED') {
          const updatedLocation = subscriptionData.data.Location.node
          const locations = previousState.allLocations.concat([updatedLocation])
          const oldLocationIndex = locations.findIndex(location => {
            return updatedLocation.id === location.id
          })
          locations[oldLocationIndex] = updatedLocation
          return {
            allLocations: locations,
          }
        }
        return previousState
      },
    })
  };

  _subscribeToNewMessages = () => {
    this.props.allMessagesQuery.subscribeToMore({
      document: gql`
        subscription {
          Message(filter: { mutation_in: [CREATED] }) {
            node {
              id
              content
              createdAt
              sentBy {
                id
                name
              }
            }
          }
        }
      `,
      updateQuery: (previousState, { subscriptionData }) => {
        const newMessage = subscriptionData.data.Message.node
        const messages = previousState.allMessages.concat([newMessage])
        return {
          allMessages: messages,
        }
      },
      onError: err => console.error(err)
    });
  };

  componentDidMount() {
    this._subscribeToNewMessages();
    this._subscribeToLocationUpdates();
  }

  render() {
    const allMessages = this.props.allMessagesQuery.allMessages || [];

    return isAuthenticated() ? (
      <div className="container">
        <UserCount />
        <h2>Chats</h2>
        <section className="chats">
          {allMessages.map(message => (
            <Chatbox key={message.id} message={message} />
          ))}
        </section>
        <ChatInput
        message={this.state.content}
        onTextInput={(content) => this.setState({content})}
        onResetText={() => this.setState({content: ''})}
        onSend={this._createMessage}
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

export default compose(
  graphql(ALL_MESSAGES_QUERY, { name: 'allMessagesQuery' }),
  graphql(CREATE_MESSAGE_MUTATION, { name: 'createMessageMutation' }),
  graphql(ALL_LOCATIONS_QUERY, { name: 'allLocationsQuery' }),
  graphql(CREATE_LOCATION_AND_USER_MUTATION, { name: 'createLocationAndUserMutation' }),
  graphql(UPDATE_LOCATION_MUTATION, { name: 'updateLocationMutation' })
)(Chat);
