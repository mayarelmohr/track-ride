import React, { useState, useEffect } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} from "react-google-maps";
import { connect } from "react-redux";
import {
  getOrigin,
  getDestination,
  getStationsBetweenStartAndEnd,
} from "../../selectors/stations";

import mapStyles from "./mapStyle.json";

var google;

const MapElement = React.memo((props) => {
  const [directions, setDirections] = useState();
  const { stations, originStation, destination, middleStations } = props;

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
        origin: new LatLng(originStation.lat, originStation.lng),
        destination: new LatLng(destination.lat, destination.lng),
        waypoints: wayPoints,
        travelMode: "DRIVING",
        drivingOptions: {
          departureTime: new Date(),
        },
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, [stations]);
  return (
    <GoogleMap
      defaultZoom={7}
      defaultOptions={{
        drawingControl: false,
        styles: mapStyles,
        disableDefaultUI: true,
      }}
      defaultCenter={new window.google.maps.LatLng(29.99509712, 31.4459768)}
    >
      <DirectionsRenderer
        options={{
          polylineOptions: { strokeColor: "#FF003E" },
          markerOptions: {
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 4.5,
              fillColor: "#000",
              fillOpacity: 1,
              strokeWeight: 0.3,
            },
          },
        }}
        directions={directions}
      />
    </GoogleMap>
  );
});

const mapStateToProps = (state) => {
  const { stations } = state.trip;
  const originStation = getOrigin(stations);
  const destination = getDestination(stations);
  const middleStations = getStationsBetweenStartAndEnd(stations);
  return { stations, originStation, destination, middleStations };
};
export default connect(
  mapStateToProps,
  {}
)(withScriptjs(withGoogleMap(MapElement)));
