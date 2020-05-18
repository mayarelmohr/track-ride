import React from "react";
import Map from "./map";

const MapContainer = React.memo(({ isMarkerVisible }) => (
  <Map
    googleMapURL={process.env.REACT_APP_GOOGLE_MAPS_API}
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `400px`, overflow: "hidden" }} />}
    mapElement={<div style={{ height: `100%` }} />}
    isMarkerVisible={isMarkerVisible}
  />
));

export default MapContainer;
