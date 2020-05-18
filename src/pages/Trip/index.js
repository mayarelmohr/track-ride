import React, { useEffect, useState } from "react";
import GoogleMap from "../../components/Map";
import { connect } from "react-redux";
import AddPassengerFrom from "../../components/AddPassengerForm";
import Bookings from "../../components/Bookings";
import TripInformation from "../../components/TripInformation";
import { csv } from "d3";
import {
  setStations,
  updateMarkerLocation,
  updateMarkerPosition,
  setTripState,
  updateBookings,
  setBookings,
  setTripTime,
} from "../../reducers/trip";
import Button from "../../components/Common/Button";
import {
  getStationsPath,
  getDistance,
  calculateStopDurationPerStepInPath,
} from "../../selectors/stations";
import styles from "./styles.module.css";
import delay from "../../helpers/delay";
import {
  TRIP_TIME,
  STATION_STOP_DURATION,
  TRIP_STATE,
} from "../../helpers/constants";

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
  const {
    bookingsList,
    distance,
    tripTime,
    paths,
    stepDuration,
    tripState,
    markerPosition,
    isDataReady,
  } = props;

  useEffect(() => {
    if (tripState === TRIP_STATE.TRACKING) {
      startRide({
        paths,
        stepDuration,
        stationDuration: STATION_STOP_DURATION,
        startPosX: markerPosition.x,
        startPosY: markerPosition.y,
      });
    }
    if (!isDataReady) {
      readCSV();
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const startRide = (rideInfo) => {
    if (!requestRefAnimationRef.current) {
      requestRefAnimationRef.current = window.requestAnimationFrame(() => {
        updateLocation(rideInfo);
      });
    }
  };

  const updateLocation = async ({
    paths,
    stepDuration,
    stationDuration,
    startPosX = 0,
    startPosY = 0,
  }) => {
    for (let i = startPosX; i < paths.length; i++) {
      let path = paths[i];
      props.updateBookingsAction(i);
      for (let j = startPosY; j < path.length; j++) {
        let step = path[j];
        await delay(stepDuration);
        props.updateMarkerPositionsAction({
          x: i,
          y: j,
        });
        props.updateMarkerLocationAction({
          lat: step.lat,
          lng: step.lng,
        });
      }
      await delay(stationDuration);
    }
    props.setTripStateAction(TRIP_STATE.FINISHED);
    window.cancelAnimationFrame(requestRefAnimationRef);
  };
  if (isLoading) {
    return "Loading";
  }
  return (
    <div>
      <GoogleMap />
      <div className={styles.container}>
        <div className={styles.buttons}>
          <Button
            text="Start ride"
            type="button"
            disabled={tripState !== TRIP_STATE.IDLE}
            action={() => {
              props.setTripStateAction(TRIP_STATE.TRACKING);
              startRide({
                paths,
                stepDuration,
                stationDuration: STATION_STOP_DURATION,
                startPosX: 0,
                startPosY: 0,
              });
            }}
          />
          <Button
            text="Book ride"
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
    currentStation,
    tripTime,
    tripState,
    markerPosition,
    isDataReady,
  } = state.trip;
  let { stations } = state.trip;
  const paths = getStationsPath(directions);
  const distance = getDistance(directions);
  const stepDuration = calculateStopDurationPerStepInPath(
    stations,
    paths,
    tripTime,
    STATION_STOP_DURATION
  );
  const { bookings } = stations.get(currentStation) || [];
  return {
    isDataReady,
    markerPosition,
    distance,
    stepDuration,
    tripTime,
    tripState,
    paths,
    bookingsList: bookings || [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStationsAction: (data) => dispatch(setStations(data)),
    setBookingsAction: (data) => dispatch(setBookings(data)),
    updateBookingsAction: (index) => dispatch(updateBookings(index)),
    updateMarkerLocationAction: ({ lat, lng }) =>
      dispatch(updateMarkerLocation({ lat, lng })),
    updateMarkerPositionsAction: ({ x, y }) =>
      dispatch(updateMarkerPosition({ x, y })),
    setTripTimeAction: (time) => dispatch(setTripTime(time)),
    setTripStateAction: (state) => dispatch(setTripState(state)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Trip);
