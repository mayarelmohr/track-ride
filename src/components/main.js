import React, { useEffect, useState } from "react";
import GoogleMap from "./Map";
import { connect } from "react-redux";
import { OrderedMap } from "immutable";
import AddPassengerFrom from "./AddPassengerForm";
import Bookings from "./Bookings";
import TripInformation from "./TripInformation";
import { csv, format } from "d3";
import {
  setStations,
  updateMarkerLocation,
  setBookings,
  setTripTime,
} from "../reducers/trip";
import Button from "./Common/Button";
import {
  getStationsPath,
  getDistance,
  calculateStopDurationPerStepInPath,
} from "../selectors/stations";
import styles from "./styles.module.css";
import delay from "../helpers/delay";
import { TRIP_TIME, STATION_STOP_DURATION } from "../helpers/constants";

const Trip = (props) => {
  const [isLoading, setLoading] = useState(true);
  const [isBookRideFormVisible, setBookRideFormVisibility] = useState(false);
  const requestRefAnimationRef = React.useRef();
  const readCSV = async () => {
    const stationsData = await csv("./data/route.csv");
    props.setStationsAction(stationsData);
    const usersData = await csv("./data/users.csv");
    props.setBookingsAction(usersData);
    props.setTripTimeAction(TRIP_TIME);
  };
  useEffect(() => {
    if (props.isDataReady) {
      readCSV();
      setLoading(false);
    }
    setLoading(false);
  }, []);

  const startRide = (paths, stepDuration = 0, stationDuration = 0) => {
    if (!requestRefAnimationRef.current) {
      requestRefAnimationRef.current = window.requestAnimationFrame(() => {
        updateLocation(paths, stepDuration, stationDuration);
      });
    }
  };

  const updateLocation = async (paths, stepDuration, stationDuration) => {
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      for (let j = 0; j < path.length; j++) {
        let step = path[j];
        await delay(stepDuration);
        props.updateMarkerLocationAction({
          lat: step.lat(),
          lng: step.lng(),
        });
      }
      await delay(stationDuration);
    }
    window.cancelAnimationFrame(requestRefAnimationRef);
  };
  if (isLoading) {
    return "Loading";
  }

  const { bookingsList, distance, tripTime, paths, stepDuration } = props;
  return (
    <div>
      <GoogleMap />
      <div className={styles.container}>
        <div className={styles.buttons}>
          <Button
            text="Start ride"
            type="button"
            action={() => {
              startRide(paths, stepDuration, STATION_STOP_DURATION);
            }}
          />
          <Button
            text="Book ride"
            type="button"
            action={() => {
              setBookRideFormVisibility(true);
            }}
          />
        </div>
        <TripInformation distance={distance} time={tripTime} />
        <Bookings bookingsList={bookingsList} />
        <AddPassengerFrom
          isModalVisible={isBookRideFormVisible}
          closeModal={() => setBookRideFormVisibility(false)}
          contentLabel="Add credit card"
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { directions, currentStation, tripTime } = state.trip;
  let { stations } = state.trip;
  const paths = getStationsPath(directions);
  const distance = getDistance(directions);
  const stepDuration = calculateStopDurationPerStepInPath(
    stations,
    paths,
    TRIP_TIME,
    STATION_STOP_DURATION
  );
  const { bookings } = stations.get(currentStation) || [];
  return {
    isReady,
    distance,
    stepDuration,
    tripTime,
    paths,
    stepDuration,
    bookingsList: bookings,
    tripTime,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStationsAction: (data) => dispatch(setStations(data)),
    setBookingsAction: (data) => dispatch(setBookings(data)),
    updateMarkerLocationAction: ({ lat, lng }) =>
      dispatch(updateMarkerLocation({ lat, lng })),
    setTripTimeAction: (time) => dispatch(setTripTime(time)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Trip);
