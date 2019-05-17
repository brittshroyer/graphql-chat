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

const ACTIVE_USERS_SUBSCRIPTION = gql`
  subscription {
    User(filter: {
        mutation_in: [CREATED, UPDATED]
        updatedFields_contains: "active"
    }) {
      mutation
      node {
        id
        name
        active
        typing
      }
    }
  }
`;


  const ACTIVE_USERS_QUERY = gql`
    query allUsers($active: Boolean!) {
      allUsers(
        filter: {
          active: $active
        }
      ) {
      id
      name
      }
    }
  `;

// const ACTIVE_USERS_QUERY = gql`
//   query allUsers($active: Boolean!) {
//
//     User
//       id
//       name
//       active: $active
//       typing
//     }
//   }
// `;

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
  ACTIVE_USERS_QUERY,
  ACTIVE_USERS_SUBSCRIPTION,
  ALL_MESSAGES_QUERY
};

// export default queries;
