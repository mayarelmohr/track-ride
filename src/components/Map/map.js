import React, { useEffect } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "react-google-maps";

import { connect } from "react-redux";
import MarkerInfo from "./markerInfo";

import {
  getStartPointSelector,
  getEndPointSelector,
  getStationsBetweenStartAndEndSelector,
} from "../../selectors/stations";

import { setDirections } from "../../reducers/trip";

import mapStyles from "./mapStyles/map.json";

const MapElement = (props) => {
  const {
    stations,
    startPoint,
    endPoint,
    middleStations,
    currentStationPosition,
    currentLocation,
    directions,
  } = props;
  const getDirections = () => {
    const { google } = window;
    const { LatLng } = google.maps;
    const DirectionsService = new google.maps.DirectionsService();
    const wayPoints = middleStations.map((point) => {
      return {
        location: new google.maps.LatLng(point.lat, point.lng),
        stopover: true,
      };
    });
    DirectionsService.route(
      {
        origin: new LatLng(startPoint.lat, startPoint.lng),
        destination: new LatLng(endPoint.lat, endPoint.lng),
        waypoints: wayPoints,
        travelMode: "DRIVING",
        drivingOptions: {
          departureTime: new Date(),
        },
      },
      async (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          await props.setDirectionsAction(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };
  useEffect(() => {
    getDirections();
  }, []);
  return (
    <GoogleMap
      defaultZoom={7.5}
      defaultOptions={{
        drawingControl: false,
        styles: mapStyles,
        disableDefaultUI: true,
      }}
      defaultCenter={
        new window.google.maps.LatLng(
          currentStationPosition.lat,
          currentStationPosition.lng
        )
      }
    >
      <DirectionsRenderer
        options={{
          polylineOptions: { strokeColor: "#FD376B" },
          markerOptions: {
            visible: false,
          },
        }}
        directions={directions}
      />
      {stations.map((station) => (
        <MarkerInfo
          station={station}
          key={station.id}
          large={station.id === startPoint.id || station.id === endPoint.id}
        />
      ))}

      <Marker
        defaultIcon={"./images/car.svg"}
        position={{
          lat: currentLocation.lat,
          lng: currentLocation.lng,
        }}
      />
    </GoogleMap>
  );
};

const mapStateToProps = (state) => {
  const { directions, currentStation } = state.trip;
  let { stations } = state.trip;
  const startPoint = getStartPointSelector(state);
  const endPoint = getEndPointSelector(state);
  const middleStations = getStationsBetweenStartAndEndSelector(state);
  const currentStationPosition = stations.get(currentStation) || {};
  return {
    currentStationPosition,
    stations,
    startPoint,
    endPoint,
    middleStations,
    directions,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setDirectionsAction: (data) => dispatch(setDirections(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withScriptjs(withGoogleMap(MapElement)));
