import React, { useEffect, useState } from "react";
import GoogleMap from "./Map";
import { connect } from "react-redux";
import { OrderedMap } from "immutable";
import AddPassengerFrom from "./AddPassengerForm";
import Bookings from "./Bookings";
import TripInformation from "./TripInformation";
import { csv } from "d3";
import {
  setStations,
  updateMarkerPosition,
  //setCurrentStation,
  setTripState,
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
import {
  TRIP_TIME,
  STATION_STOP_DURATION,
  TRIP_STATE,
} from "../helpers/constants";

const Trip = (props) => {
  const [isLoading, setLoading] = useState(true);
  const [isBookRideFormVisible, setBookRideFormVisibility] = useState(false);
  const [isMarkerVisible, setMarkerVisible] = useState(false);
  const requestRefAnimationRef = React.useRef();

  const readCSV = async () => {
    if (!props.isDataReady) {
      const stationsData = await csv("./data/route.csv");
      props.setStationsAction(stationsData);
      const usersData = await csv("./data/users.csv");
      props.setBookingsAction(usersData);
      props.setTripTimeAction(TRIP_TIME);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (props.tripState === TRIP_STATE.TRACKING) {
      window.cancelAnimationFrame(requestRefAnimationRef);

      const {
        paths,
        stepDuration,
        currentMarkerPosition: { xPos, yPos },
      } = props;
      // startRide({
      //   paths,
      //   stepDuration,
      //   STATION_STOP_DURATION,
      //   startXPos: xPos,
      //   startYPos: yPos,
      // });
    }
    if (!props.isDataReady) {
      readCSV();
    } else {
      setLoading(false);
    }
    // return () => {
    //   setMarkerVisible(false);
    // };
  }, []);

  const startRide = (ride) => {
    updateLocation(ride);
    if (!requestRefAnimationRef.current) {
      requestRefAnimationRef.current = window.requestAnimationFrame(
        function () {
          updateLocation(ride);
        }
      );
    }
  };

  const updateLocation = async ({
    paths,
    stepDuration = 0,
    stationDuration = 0,
    startXPos = 0,
    startYPos = 0,
  }) => {
    for (let i = startXPos; i < paths.length; i++) {
      let path = paths[i];
      for (let j = startYPos; j < path.length; j++) {
        let step = path[j];
        props.updateMarkerPositionAction({
          lat: step.lat(),
          lng: step.lng(),
        });
        await delay(stepDuration);
      }
      await delay(stationDuration);
    }
    props.setTripStateAction(TRIP_STATE.FINISHED);
    window.cancelAnimationFrame(requestRefAnimationRef);
  };
  if (isLoading) {
    return "Loading";
  }
  const {
    bookingsList,
    distance,
    tripTime,
    paths,
    stepDuration,
    tripState,
  } = props;
  return (
    <div>
      <GoogleMap isMarkerVisible={isMarkerVisible} />
      <div className={styles.container}>
        <div className={styles.buttons}>
          <Button
            text="Start ride"
            type="button"
            //disabled={tripState === TRIP_STATE.TRACKING}
            action={() => {
              props.setTripStateAction(TRIP_STATE.TRACKING);
              startRide({ paths, stepDuration, STATION_STOP_DURATION });
            }}
          />
          <Button
            text="Book ride"
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
    directions,
    isDataReady,
    currentStation,
    currentMarkerPosition,
    tripTime,
    tripState,
  } = state.trip;
  let { stations } = state.trip;
  const paths = getStationsPath(directions);
  const distance = getDistance(directions);
  if (!OrderedMap.isOrderedMap(stations)) {
    stations = new OrderedMap(stations);
  }
  const stepDuration = calculateStopDurationPerStepInPath(
    stations,
    paths,
    TRIP_TIME,
    STATION_STOP_DURATION
  );
  const { bookings } = stations.get(currentStation) || [];
  return {
    currentMarkerPosition,
    tripState,
    isDataReady,
    distance,
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
    updateMarkerPositionAction: ({ lat, lng }) =>
      dispatch(updateMarkerPosition({ lat, lng })),
    setTripTimeAction: (time) => dispatch(setTripTime(time)),
    setTripStateAction: (tripState) => dispatch(setTripState(tripState)),
    // setCurrentStationAction: (stationIndex) =>
    //   dispatch(setCurrentStation(stationIndex)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Trip);
