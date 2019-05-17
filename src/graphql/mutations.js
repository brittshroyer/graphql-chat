import gql from 'graphql-tag';

const CREATE_LOCATION_AND_USER_MUTATION = gql`
    mutation createLocationAndUser($name: String!, $latitude: Float!, $longitude: Float!, $active: Boolean!, $typing: Boolean!) {
        createLocation(latitude: $latitude, longitude: $longitude, user: {
            name: $name,
            active: $active,
            typing: $typing
        }) {
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

const UPDATE_USER_STATUS_MUTATION = gql`
    mutation updateUserStatus($id: ID!, $active: Boolean!) {
      updateUser(id: $id, active: $active) {
        id
        active
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

export {
  CREATE_LOCATION_AND_USER_MUTATION,
  UPDATE_LOCATION_MUTATION,
  CREATE_MESSAGE_MUTATION,
  UPDATE_USER_STATUS_MUTATION
};
