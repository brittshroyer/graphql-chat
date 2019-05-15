import gql from 'graphql-tag';

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

const USER_FOR_ID_QUERY = gql`
  query userForId($id: ID!) {
    User(id: $id) {
      id
      name
      location {
        id
        latitude
        longitude
      }
    }
  }
`;

const LOCATION_SUBSCRIPTION = gql`
  subscription {
    Location(filter: {
        mutation_in: [CREATED, UPDATED]
    }) {
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
`;

const MESSAGES_SUBSCRIPTION = gql`
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
`;

const ALL_MESSAGES_QUERY = gql`
  query allMessages {
    allMessages(last: 50) {
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

export {
  ALL_LOCATIONS_QUERY,
  USER_FOR_ID_QUERY,
  LOCATION_SUBSCRIPTION,
  MESSAGES_SUBSCRIPTION,
  ALL_MESSAGES_QUERY
};

// export default queries;
