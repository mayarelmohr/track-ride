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
  getOrigin,
  getDestination,
  getStationsBetweenStartAndEnd,
  getStationsPath,
} from "../../selectors/stations";

import { setDirections, updateMarkerLocation } from "../../reducers/trip";

import mapStyles from "./mapStyles/map.json";

var google;

const MapElement = React.memo((props) => {
  const { stations, origin, destination, middleStations, path } = props;
  useEffect(() => {
    google = window.google;
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
        origin: new LatLng(origin.lat, origin.lng),
        destination: new LatLng(destination.lat, destination.lng),
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
  }, [stations]);

  return (
    <GoogleMap
      defaultZoom={7.5}
      defaultOptions={{
        drawingControl: false,
        styles: mapStyles,
        disableDefaultUI: true,
      }}
      defaultCenter={
        new window.google.maps.LatLng(stations[3].lat, stations[3].lng)
      }
    >
      <DirectionsRenderer
        options={{
          polylineOptions: { strokeColor: "#FD376B" },
          markerOptions: {
            visible: false,
          },
        }}
        directions={props.directions}
      />
      {stations.map((station) => (
        <MarkerInfo
          station={station}
          large={station.id === origin.id || station.id === destination.id}
        />
      ))}
      <Marker
        defaultIcon={"./car.svg"}
        position={{
          lat: props.currentLocation.lat,
          lng: props.currentLocation.lng,
        }}
      />
    </GoogleMap>
  );
});

const mapStateToProps = (state) => {
  const { stations, directions, currentLocation } = state.trip;
  const origin = getOrigin(stations);
  const destination = getDestination(stations);
  const middleStations = getStationsBetweenStartAndEnd(stations);
  const path = getStationsPath(directions);
  return {
    stations,
    origin,
    destination,
    middleStations,
    directions,
    currentLocation,
    path,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setDirectionsAction: (data) => dispatch(setDirections(data)),
  updateMarkerLocationAction: ({ lat, lng }) =>
    dispatch(updateMarkerLocation({ lat, lng })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withScriptjs(withGoogleMap(MapElement)));
