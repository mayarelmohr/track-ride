import React, { useEffect, useState } from "react";
import GoogleMap from "./Map";
import { connect } from "react-redux";
import route from "../route.csv";
import { csv } from "d3";
import { setStations, updateMarkerLocation } from "../reducers/trip";
import Button from "./Common/Button";
import { getStationsPath } from "../selectors/stations";

const Trip = (props) => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function readCSV() {
      const data = await csv(route);
      props.setStationsAction(data);
      setLoading(false);
    }
    readCSV();
  }, []);
  if (isLoading) {
    return "Loading";
  }
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const updateLocation = async () => {
    const { paths } = props;
    for (let j = 0; j < paths.length; j++) {
      let path = paths[j];
      for (let i = 0; i < path.length; i++) {
        await sleep(1);
        const point = path[i];
        props.updateMarkerLocationAction({
          lat: point.lat(),
          lng: point.lng(),
        });
      }
      await sleep(3000);
    }
  };
  return (
    <div>
      <GoogleMap />
      <div>
        <Button
          text="Start ride"
          type="button"
          action={() => {
            updateLocation();
          }}
        />
        <Button
          text="Book ride"
          type="button"
          action={() => {
            //updateLocation();
          }}
        />
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  const { directions } = state.trip;
  const paths = getStationsPath(directions);
  return {
    paths,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStationsAction: (data) => dispatch(setStations(data)),
    updateMarkerLocationAction: ({ lat, lng }) =>
      dispatch(updateMarkerLocation({ lat, lng })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Trip);
