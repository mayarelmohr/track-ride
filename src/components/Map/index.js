import React from "react";
import Map from "./map";
import mapStyles from "./mapStyle.json";

const MapContainer = React.memo(() => (
  <Map
    style={mapStyles}
    googleMapURL={process.env.REACT_APP_GOOGLE_MAPS_API}
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `400px` }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
));

export default MapContainer;
