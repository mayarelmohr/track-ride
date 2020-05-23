import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { csv } from "d3";
import {
  setStations,
  setTripStartTime,
  setTripState,
  updateBookings,
  updateCurrentStation,
  setBookings,
  setTripTime,
} from "../../reducers/trip";
import Loading from "../../components/Common/Loading";
import {
  mapDirectionsToPathSelector,
  getDistanceSelector,
  getStartPointSelector,
} from "../../selectors/stations";
import { TRIP_TIME } from "../../helpers/constants";
import Trip from "../../components/TripWrapper";

const TripWrapper = (props) => {
  const [isLoading, setLoading] = useState(true);
  const initializeTrip = async () => {
    const stationsData = await csv("./data/route.csv");
    props.setStationsAction(stationsData);
    const usersData = await csv("./data/users.csv");
    props.setBookingsAction(usersData);
    props.setTripTimeAction(TRIP_TIME);
  };
  const { isDataReady } = props;

  useEffect(() => {
    if (!isDataReady) {
      /** Cached prop in stations reducer to avoid reinitializing data */
      initializeTrip().then(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return <Trip />;
};

const mapStateToProps = (state) => {
  const {
    tripTime,
    tripState,
    isDataReady,
    startTime,
    currentStation,
  } = state.trip;
  const paths = mapDirectionsToPathSelector(state);
  const distance = getDistanceSelector(state);
  const bookings =
    currentStation?.bookings || getStartPointSelector(state)?.bookings || [];

  return {
    startTime,
    isDataReady,
    distance,
    tripTime,
    tripState,
    paths,
    bookingsList: bookings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStationsAction: (data) => dispatch(setStations(data)),
    setBookingsAction: (data) => dispatch(setBookings(data)),
    updateBookingsAction: (stationId) => dispatch(updateBookings(stationId)),
    setTripTimeAction: (time) => dispatch(setTripTime(time)),
    setTripStateAction: (state) => dispatch(setTripState(state)),
    setTripStartTimeAction: (time) => dispatch(setTripStartTime(time)),
    updateCurrentStationAction: (stationId) =>
      dispatch(updateCurrentStation(stationId)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TripWrapper)
);
