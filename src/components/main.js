import React, { useEffect, useState } from "react";
import GoogleMap from "./Map";
import { connect } from "react-redux";
import route from "../route.csv";
import { csv } from "d3";
import { setStations } from "../reducers/trip";
import Button from "./Common/Button";

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
  return (
    <>
      <GoogleMap /> <Button text="Start ride" type="button" />
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStationsAction: (data) => dispatch(setStations(data)),
  };
};

export default connect(null, mapDispatchToProps)(Trip);
