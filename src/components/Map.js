import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import isAuthenticated from '../Auth/isAuthenticated';

import { withApollo, graphql, compose } from 'react-apollo';

import { ALL_LOCATIONS_QUERY, USER_FOR_ID_QUERY, LOCATION_SUBSCRIPTION  } from '../graphql/queries';
import { CREATE_LOCATION_AND_USER_MUTATION, UPDATE_LOCATION_MUTATION, UPDATE_USER_STATUS_MUTATION } from '../graphql/mutations';

import Chat from './Chat';
import WorldGoogleMap from './WorldMap';


class Map extends Component {

  state = {
    markers: [],
    userID: undefined,
    location: undefined
  }

  async componentDidMount() {
    await this.props.allLocationsQuery.subscribeToMore({
      document: LOCATION_SUBSCRIPTION,
      variables: null,
      updateQuery: (previousState, {subscriptionData}) => {
        const { data } = subscriptionData;
        if (data.Location.mutation === 'CREATED') {
          const newLocation = data.Location.node;
          const locations = previousState.allLocations.concat([newLocation]);

          return { allLocations: locations };

        } else if (data.Location.mutation === 'UPDATED') {
          const locations = previousState.allLocations.slice();
          const updatedLocation = data.Location.node;
          const oldLocationIndex = locations.findIndex(location => {
            return updatedLocation.id === location.id;
          });

          locations[oldLocationIndex] = updatedLocation;
          return { allLocations: locations };
        }

        return previousState;
      }
    });

    const userID = localStorage.getItem('world_chat_user_id');
    // Check if user already exists
    if (!userID) {
      this._createNewUser();
    } else {
      this._updateExistingUser(userID);
    }

    this.makeUserActive();

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.allLocationsQuery.allLocations) {
      // array of objects with username & position
      const newMarkers = nextProps.allLocationsQuery.allLocations.map(location => {
        const isOwnMarker = location.user.id === this.state.userID
        return {
          userName: isOwnMarker ? `${location.user.name} (You)` : location.user.name,
          position: {
            lat: location.latitude,
            lng: location.longitude,
          },
          isOwnMarker: isOwnMarker
        }
      })
      this.setState({
        markers: newMarkers,
      })
    }
  }

  render() {
    return isAuthenticated() ? (
      <div style={{height: '100%'}}>
        <WorldGoogleMap
          onMapLoad={this.handleMapLoad}
          onMapClick={this.handleMapClick}
          markers={this.state.markers}
          onMarkerClick={this.handleMarkerClick}
        />
        <Chat map={this} user={this.state.userID} />
        <button onClick={() => this.logout()}>Logout</button>
      </div>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: this.props.location }
      }} />
    )
  }

  _removeAllMarkers() {
    const newMarkers = this.state.markers.slice();

    newMarkers.forEach(marker => {
      marker.showInfo = false
    });
    this.setState({
      markers: newMarkers,
    });
  }

  _createNewUser = () => {
    if (navigator.geolocation) {
      // Retrieve location
      navigator.geolocation.getCurrentPosition(position => {
        this.props.createLocationAndUserMutation({
          variables: {
            name: this.props.name,
            active: true,
            typing: false,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        }).then(result => {
          localStorage.setItem('world_chat_user_id', result.data.createLocation.user.id);
          this.setState({
            userID: result.data.createLocation.user.id,
          });
        });
      });
    } else {
      // Create fake location
      window.alert("We could not retrieve your location, so we're putting you in Cleveland");
      const clevelandCoordinates = this._generateRandomClevelandPosition();
      this.props.createLocationAndUserMutation({
        variables: {
          name: this.props.name,
          active: true,
          typing: false,
          latitude: clevelandCoordinates.latitude,
          longitude: clevelandCoordinates.longitude
        }
      }).then(result => {
        localStorage.setItem('world_chat_user_id', result.data.createLocation.user.id);
        this.setState({
          userID: result.data.createLocation.user.id
        });
      })
    }
  }

  _updateExistingUser = async (userID) => {

    this.setState({ userID });
    // Check for user with this Id
    const userForIdResponse = await this.props.client.query(
      {
        query: USER_FOR_ID_QUERY,
        variables: {
          id: userID
        },
      }
    );

    const existingUser = userForIdResponse.data.User

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        // Retrieve location
        this.props.updateLocationMutation({
          variables: {
            locationId: existingUser.location.id,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      });
    } else {
      // Create fake location
      const clevelandCoordinates = this._generateRandomClevelandPosition();
      this.props.updateLocationMutation({
        variables: {
          locationId: existingUser.location.id,
          latitude: clevelandCoordinates.latitude,
          longitude: clevelandCoordinates.longitude
        }
      });
    }
  }

  handleMarkerClick = (targetMarker, action) => {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: action === 'open' ? true : false,
          };
        }
        return marker;
      })
    });
  };

  handleMapLoad = (map) => {
    this._mapComponent = map;
  };

  handleMapClick = () => {
    this._removeAllMarkers();
  };

  _generateRandomClevelandPosition = () => {
    const latitude = 41.4993;
    const longitude = 81.6944;
    const latitudeAdd = Math.random() > 0.5;
    const longitudeAdd = Math.random() > 0.5;
    const latitudeDelta = Math.random() * 3;
    const longitudeDelta = Math.random() * 3;
    const newLatitude = latitudeAdd ? latitude + latitudeDelta : latitude - latitudeDelta;
    const newLongitude = longitudeAdd ? longitude + longitudeDelta : longitude - longitudeDelta;

    return {latitude: newLatitude, longitude: newLongitude};
  };

  makeUserActive = () => {
    const { userID } = this.state;
    const active = true;

    this.props.updateUserStatusMutation({
      variables: { id: userID, active }
    });
  };

  logout = () => {
    const { userID } = this.state;
    const active = false;

    this.props.updateUserStatusMutation({
      variables: { id: userID, active }
    });

    this.props.history.push('/logout');
  };
}

export default compose(
  withRouter,
  graphql(ALL_LOCATIONS_QUERY, {name: 'allLocationsQuery'}),
  graphql(CREATE_LOCATION_AND_USER_MUTATION, {name: 'createLocationAndUserMutation'}),
  graphql(UPDATE_LOCATION_MUTATION, {name: 'updateLocationMutation'}),
  graphql(UPDATE_USER_STATUS_MUTATION, {name: 'updateUserStatusMutation'})
)(withApollo(Map));
