import React, { useEffect } from "react";
import GoogleMap from "./Map";
import { connect } from "react-redux";
import route from "../route.csv";
import { csv } from "d3";
import { setStations } from "../reducers/trip";

const Trip = (props) => {
  useEffect(() => {
    async function readCSV() {
      const data = await csv(route);
      props.setStationsAction(data);
    }
    readCSV();
  }, []);
  return <GoogleMap />;
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStationsAction: (data) => dispatch(setStations(data)),
  };
};

export default connect(null, mapDispatchToProps)(Trip);
