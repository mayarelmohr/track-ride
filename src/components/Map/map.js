import React, { useEffect } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "react-google-maps";
import { OrderedMap } from "immutable";

import { connect } from "react-redux";
import MarkerInfo from "./markerInfo";

import {
  getStartPoint,
  getEndPoint,
  getStationsBetweenStartAndEnd,
  getStationsPath,
} from "../../selectors/stations";

import { setDirections, updateMarkerLocation } from "../../reducers/trip";

import mapStyles from "./mapStyles/map.json";

var google;

const MapElement = React.memo((props) => {
  const {
    stations,
    startPoint,
    endPoint,
    middleStations,
    currentStationPosition,
  } = props;
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
        directions={props.directions}
      />
      {stations.map((station) => (
        <MarkerInfo
          station={station}
          large={station.id === startPoint.id || station.id === endPoint.id}
        />
      ))}
      <Marker
        defaultIcon={"./images/car.svg"}
        position={{
          lat: props.currentLocation.lat,
          lng: props.currentLocation.lng,
        }}
      />
    </GoogleMap>
  );
});

const mapStateToProps = (state) => {
  const { directions, currentLocation, currentStation } = state.trip;
  let { stations } = state.trip;
  if (!OrderedMap.isOrderedMap(stations)) {
    stations = new OrderedMap(stations);
  }
  const startPoint = getStartPoint(stations);
  const endPoint = getEndPoint(stations);
  const middleStations = getStationsBetweenStartAndEnd(stations);
  const path = getStationsPath(directions);
  const currentStationPosition = stations.get(currentStation);
  return {
    currentStationPosition,
    stations,
    startPoint,
    endPoint,
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
