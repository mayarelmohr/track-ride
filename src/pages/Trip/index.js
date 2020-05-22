import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import GoogleMap from "../../components/Map";
import AddPassengerFrom from "../../components/AddPassengerForm";
import Bookings from "../../components/Bookings";
import TripInformation from "../../components/TripInformation";
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
import Button from "../../components/Common/Button";
import Loading from "../../components/Common/Loading";
import {
  mapDirectionsToPath,
  getDistance,
  getStartPoint,
} from "../../selectors/stations";
import styles from "./styles.module.css";
import { TRIP_TIME, TRIP_STATE } from "../../helpers/constants";

const Trip = (props) => {
  const [isLoading, setLoading] = useState(true);
  const [isBookRideFormVisible, setBookRideFormVisibility] = useState(false);
  const [markerLocation, setMarkerLocation] = useState({ lat: 0, lng: 0 });
  const requestAnimationFrameRef = React.useRef();
  const rideTimeoutRef = React.useRef();
  const readCSV = async () => {
    const stationsData = await csv("./data/route.csv");
    props.setStationsAction(stationsData);
    const usersData = await csv("./data/users.csv");
    props.setBookingsAction(usersData);
    props.setTripTimeAction(TRIP_TIME);
  };
  const {
    bookingsList,
    distance,
    tripTime,
    paths,
    startTime,
    tripState,
    isDataReady,
  } = props;

  useEffect(() => {
    if (tripState === TRIP_STATE.TRACKING) {
      rideTimeoutRef.current = setTimeout(() => {
        startRide(paths, TRIP_TIME, startTime);
      }, 300);
    }
    if (!isDataReady) {
      readCSV();
      setLoading(false);
    } else {
      setLoading(false);
    }
    return () => {
      cancelAnimationFrame(requestAnimationFrameRef.current);
      clearTimeout(rideTimeoutRef.current);
    };
  }, []);

  const startRide = (paths, duration, start) => {
    const move = (previousStationIndex = 0) => {
      const currentTime = Date.now();
      /* calculates time elapsed time since the last requested frame */
      const elapsedTime = currentTime - start;
      /* calculates the expected distance that car should have moved during this elapsed time */
      const progress = elapsedTime / duration;
      /* the next lat and lng based on the car should have made */
      const nextLatLngIndex = Math.floor(progress * paths.length);
      if (elapsedTime < duration && nextLatLngIndex < paths.length) {
        const currentStopPoint = paths[nextLatLngIndex];
        const { lat, lng, stationIndex } = currentStopPoint;
        setMarkerLocation({ lat, lng });
        if (previousStationIndex !== stationIndex) {
          props.updateCurrentStationAction(stationIndex);
          props.updateBookingsAction(stationIndex);
        }
        requestAnimationFrameRef.current = requestAnimationFrame(() => {
          move(stationIndex);
        });
      } else {
        cancelAnimationFrame(requestAnimationFrameRef.current);
        props.setTripStateAction(TRIP_STATE.FINISHED);
        props.history.push("/statistics");
      }
    };
    requestAnimationFrameRef.current = requestAnimationFrame(move);
  };

  if (isLoading) {
    return <Loading />;
  }
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
              props.updateCurrentStationAction(0);
              props.setTripStartTimeAction(start);
              startRide(paths, TRIP_TIME, start);
            }}
          />
          <Button
            text="Book ride"
            data-testid="book-ride-button"
            type="button"
            disabled={tripState !== TRIP_STATE.IDLE}
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
    directions,
    tripTime,
    tripState,
    isDataReady,
    startTime,
    currentStation,
    stations,
  } = state.trip;
  const paths = mapDirectionsToPath(directions);
  const distance = getDistance(directions);
  const bookings =
    stations.get(currentStation)?.bookings ||
    getStartPoint(stations)?.bookings ||
    [];

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
    updateBookingsAction: (index) => dispatch(updateBookings(index)),
    setTripTimeAction: (time) => dispatch(setTripTime(time)),
    setTripStateAction: (state) => dispatch(setTripState(state)),
    setTripStartTimeAction: (time) => dispatch(setTripStartTime(time)),
    updateCurrentStationAction: (index) =>
      dispatch(updateCurrentStation(index)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Trip));
