import React, { useState, useEffect } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} from "react-google-maps";
import mapStyles from "./mapStyle.json";

const MapElement = React.memo((props) => {
  const [directions, setDirections] = useState();
  const { google } = window;
  useEffect(() => {
    const DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route(
      {
        origin: new google.maps.LatLng(29.99509712, 31.4459768),
        destination: new google.maps.LatLng(30.08201257, 31.34388217),
        waypoints: [
          {
            location: new google.maps.LatLng(30.01288023, 31.43102269),
          },
          {
            location: new google.maps.LatLng(30.01642345, 31.43356512),
          },
          {
            location: new google.maps.LatLng(30.01637555, 31.39839364),
          },
          {
            location: new google.maps.LatLng(30.0409879, 31.34613896),
          },
          {
            location: new google.maps.LatLng(30.04505095, 31.34143553),
          },
          {
            location: new google.maps.LatLng(30.05408947, 31.3421715),
          },
          {
            location: new google.maps.LatLng(30.06198228, 31.34523262),
          },
          {
            location: new google.maps.LatLng(30.07322503, 31.34378507),
          },
          {
            location: new google.maps.LatLng(30.08201257, 31.34388217),
          },
          {
            location: new google.maps.LatLng(30.06198228, 31.34523262),
          },
        ],
        provideRouteAlternatives: false,
        travelMode: "DRIVING",
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: "pessimistic",
        },
        unitSystem: google.maps.UnitSystem.IMPERIAL,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, []);
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
              scale: 6.5,
              fillColor: "#000",
              fillOpacity: 1,
              strokeWeight: 0.4,
            },
          },
        }}
        directions={directions}
      />
    </GoogleMap>
  );
});

export default withScriptjs(withGoogleMap(MapElement));
