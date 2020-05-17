import React from "react";
import Map from "./map";
import styles from "./styles.module.css";

const MapContainer = React.memo(() => (
  <Map
    googleMapURL={process.env.REACT_APP_GOOGLE_MAPS_API}
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `400px`, overflow: "hidden" }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
));

export default MapContainer;
