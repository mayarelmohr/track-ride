import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import GoogleMap from "../Map";
import AddPassengerFrom from "../AddPassengerForm";
import Bookings from "../Bookings";
import TripInformation from "../TripInformation";
import {
  setTripStartTime,
  setTripState,
  updateBookings,
  updateCurrentStation,
} from "../../reducers/trip";
import Button from "../Common/Button";
import {
  mapDirectionsToPathSelector,
  getDistanceSelector,
  getStartPointSelector,
} from "../../selectors/stations";
import styles from "./styles.module.css";
import { TRIP_STATE } from "../../helpers/constants";

const Trip = (props) => {
  const [isBookRideFormVisible, setBookRideFormVisibility] = useState(false);
  const [markerLocation, setMarkerLocation] = useState({ lat: 0, lng: 0 });
  const requestAnimationFrameRef = React.useRef();
  const rideTimeoutRef = React.useRef();
  const {
    bookingsList,
    distance,
    tripTime,
    paths,
    startTime,
    tripState,
  } = props;

  useEffect(() => {
    if (tripState === TRIP_STATE.TRACKING) {
      /** To Reload car location from the expected point
       * Timeout is just set for delay */
      rideTimeoutRef.current = setTimeout(() => {
        startRide(paths, tripTime, startTime);
      }, 300);
    }
    return () => {
      cancelAnimationFrame(requestAnimationFrameRef.current);
      clearTimeout(rideTimeoutRef.current);
    };
  }, [paths, tripTime, tripState, startTime]);

  const startRide = (paths, duration, start) => {
    const move = (previousStationId) => {
      const currentTime = Date.now();
      /* calculates time elapsed time since the last requested frame */
      const elapsedTime = currentTime - start;
      /* calculates the expected distance that car should have moved during this elapsed time */
      const progress = elapsedTime / duration;
      /* the next lat and lng based on the car should have made */
      const nextLatLngIndex = Math.floor(progress * paths.length);
      if (elapsedTime < duration && nextLatLngIndex < paths.length) {
        const currentStopPoint = paths[nextLatLngIndex];
        const { lat, lng, stationId } = currentStopPoint;
        setMarkerLocation({ lat, lng });
        if (previousStationId !== stationId) {
          /** the new lat and lngs are in a new station */
          props.updateCurrentStationAction(stationId);
          props.updateBookingsAction(stationId);
        }
        requestAnimationFrameRef.current = requestAnimationFrame(() => {
          move(stationId);
        });
      } else {
        cancelAnimationFrame(requestAnimationFrameRef.current);
        props.setTripStateAction(TRIP_STATE.FINISHED);
        props.history.push("/statistics");
      }
    };
    requestAnimationFrameRef.current = requestAnimationFrame(move);
  };

  return (
    <div>
      <GoogleMap markerLocation={markerLocation} data-testid="map" />
      <div className={styles.container}>
        <div className={styles.buttons}>
          <Button
            text="Start ride"
            data-testid="start-ride-button"
            type="button"
            disabled={tripState === TRIP_STATE.TRACKING}
            action={() => {
              props.setTripStateAction(TRIP_STATE.TRACKING);
              const start = Date.now();
              props.setTripStartTimeAction(start);
              startRide(paths, tripTime, start);
            }}
          />
          <Button
            text="Book ride"
            data-testid="book-ride-button"
            type="button"
            disabled={tripState === TRIP_STATE.TRACKING}
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
    updateBookingsAction: (stationId) => dispatch(updateBookings(stationId)),
    setTripStateAction: (state) => dispatch(setTripState(state)),
    setTripStartTimeAction: (time) => dispatch(setTripStartTime(time)),
    updateCurrentStationAction: (stationId) =>
      dispatch(updateCurrentStation(stationId)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Trip));
