import React, { useEffect, useState } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "react-google-maps";
import { OrderedMap, set } from "immutable";

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

const MapElement = (props) => {
  const {
    stations,
    startPoint,
    endPoint,
    middleStations,
    currentMarkerPosition,
  } = props;
  const [isLoadingDirections, setLoadingDirections] = useState(true);
  const getDirections = () => {
    const { LatLng } = window.google.maps;
    const DirectionsService = new window.google.maps.DirectionsService();
    const wayPoints = middleStations.map((point) => {
      return {
        location: new window.google.maps.LatLng(point.lat, point.lng),
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
        if (status === window.google.maps.DirectionsStatus.OK) {
          await props.setDirectionsAction(result);
          debugger;
          setLoadingDirections(false);
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
      // defaultCenter={
      //   new window.google.maps.LatLng(
      //     currentStationPosition.lat,
      //     currentStationPosition.lng
      //   )
      // }
    >
      {!isLoadingDirections ? (
        <DirectionsRenderer
          options={{
            polylineOptions: { strokeColor: "#FD376B" },
            markerOptions: {
              visible: false,
            },
          }}
          directions={props.directions}
        />
      ) : null}

      {stations.map((station) => (
        <MarkerInfo
          station={station}
          large={station.id === startPoint.id || station.id === endPoint.id}
        />
      ))}
      {!isLoadingDirections ? (
        <Marker
          defaultIcon={"./images/car.svg"}
          position={{
            lat: currentMarkerPosition.lat,
            lng: currentMarkerPosition.lng,
          }}
        />
      ) : null}
    </GoogleMap>
  );
};

const mapStateToProps = (state) => {
  const {
    directions,
    currentMarkerPosition,
    currentStation,
    isMapReady,
  } = state.trip;
  let { stations } = state.trip;
  if (!OrderedMap.isOrderedMap(stations)) {
    stations = new OrderedMap(stations);
  }
  const startPoint = getStartPoint(stations);
  const endPoint = getEndPoint(stations);
  const middleStations = getStationsBetweenStartAndEnd(stations);
  const currentStationPosition = stations.get(currentStation);

  debugger;
  return {
    isMapReady,
    currentStationPosition,
    currentMarkerPosition,
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
