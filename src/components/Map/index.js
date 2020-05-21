import React from "react";
import GoogleMap from "./map";

const MapContainer = ({ isMarkerVisible, markerLocation }) => (
  <GoogleMap
    googleMapURL={process.env.REACT_APP_GOOGLE_MAPS_API}
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `400px`, overflow: "hidden" }} />}
    mapElement={<div style={{ height: `100%` }} />}
    isMarkerVisible={isMarkerVisible}
    currentLocation={markerLocation}
  />
);

export default MapContainer;
