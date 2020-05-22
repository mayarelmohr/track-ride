import React from "react";
import GoogleMap from "./map";

const MapContainer = ({ markerLocation }) => (
  <GoogleMap
    googleMapURL={process.env.REACT_APP_GOOGLE_MAPS_API}
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `400px`, overflow: "hidden" }} />}
    mapElement={<div style={{ height: `100%` }} />}
    currentLocation={markerLocation}
  />
);

export default MapContainer;
