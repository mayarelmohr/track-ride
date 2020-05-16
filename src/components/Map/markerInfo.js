import React, { useState } from "react";
import { Marker } from "react-google-maps";
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox";
import styles from "./styles.module.css";
import markerStyle from "./mapStyles/mapMarker.json";

const MarkerInfo = React.memo((props) => {
  const { station, large } = props;
  const { google } = window;
  const [isVisible, toggleVisibility] = useState(false);
  return (
    <Marker
      key={station.id}
      icon={{
        path: window.google.maps.SymbolPath.CIRCLE,
        ...(large ? markerStyle.largeCircle : markerStyle.smallCircle),
      }}
      position={{ lat: station.lat, lng: station.lng }}
      onClick={() => toggleVisibility(!isVisible)}
    >
      <InfoBox
        visible={isVisible}
        defaultPosition={new google.maps.LatLng(station.lat, station.lng)}
        options={{ closeBoxURL: ``, enableEventPropagation: true }}
      >
        <div className={styles.info}>
          <div className={styles.infoWrapper}>
            <span>ETA</span>
            <span>12:12</span>
          </div>
        </div>
      </InfoBox>
    </Marker>
  );
});

export default MarkerInfo;
