import React from 'react';
import { GoogleMap, withGoogleMap, Marker, InfoWindow, withScriptjs } from 'react-google-maps';
import { withProps, compose } from "recompose";

const DEFAULT_COORDINATES = { lat: 40, lng: -40 };
const GOOGLE_MAP_URL = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyCedl-z2FCu87QocGvWB_GW0mLBPiy7-Kg';


const WorldGoogleMap = compose(
  withProps({
    googleMapURL: GOOGLE_MAP_URL,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={3}
    defaultCenter={DEFAULT_COORDINATES}
    onClick={props.onMapClick}
    defaultOptions={{ disableDefaultUI: true }}
    loadingElement={
      <div style={{height: `100%`}}>
        Loading
      </div>
    }
    containerElement={
      <div style={{ height: `100%` }} />
    }
    mapElement={
      <div style={{ height: `100%` }} />
    }
  >
    {props.markers && props.markers.map((marker , index) => (
      <Marker
        {...marker}
        showInfo={false}
        icon={marker.isOwnMarker ? require('../assets/marker_blue.svg') : require('../assets/marker.svg')}
        onClick={() => props.onMarkerClick(marker)}
        defaultAnimation={2}
        key={index}
      >
        {marker.showInfo && (
          <InfoWindow
            onCloseClick={() => props.onMarkerClose(marker)}>
            <div className=''>{marker.userName}</div>
          </InfoWindow>
        )}
      </Marker>
    ))}
  </GoogleMap>
)

export default WorldGoogleMap;
