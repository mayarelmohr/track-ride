import React, { useEffect, useState } from "react";
import GoogleMap from "./Map";
import { connect } from "react-redux";
import AddPassengerFrom from "./AddPassengerForm";
import Bookings from "./Bookings";
import TripInformation from "./TripInformation";
import { csv } from "d3";
import {
  setStations,
  updateMarkerLocation,
  setBookings,
} from "../reducers/trip";
import Button from "./Common/Button";
import { getStationsPath, getDistance } from "../selectors/stations";
import styles from "./styles.module.css";
import delay from "../helpers/delay";

const Trip = (props) => {
  const [isLoading, setLoading] = useState(true);
  const [isBookRideFormVisible, setBookRideFormVisibility] = useState(false);
  const requestRefAnimationRef = React.useRef();
  useEffect(() => {
    async function readCSV() {
      const stationsData = await csv("./data/route.csv");
      props.setStationsAction(stationsData);
      const usersData = await csv("./data/users.csv");
      props.setBookingsAction(usersData);
      setLoading(false);
    }
    readCSV();
  }, []);

  const startRide = () => {
    if (!requestRefAnimationRef.current) {
      requestRefAnimationRef.current = window.requestAnimationFrame(
        updateLocation
      );
    }
  };

  const updateLocation = async () => {
    const { paths } = props;
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      path.every(async (point, index) => {
        await delay(3 * index + 1);
        props.updateMarkerLocationAction({
          lat: point.lat(),
          lng: point.lng(),
        });
      });
      await delay(1000);
    }
    window.cancelAnimationFrame(requestRefAnimationRef);
  };
  if (isLoading) {
    return "Loading";
  }

  const { bookingsList, distance } = props;
  return (
    <div>
      <GoogleMap />
      <div className={styles.container}>
        <div className={styles.buttons}>
          <Button
            text="Start ride"
            type="button"
            action={() => {
              startRide();
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
        <TripInformation distance={distance} />
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
  const { directions, currentStation, stations } = state.trip;
  const paths = getStationsPath(directions);
  const distance = getDistance(directions);
  const { bookings } = stations.get(currentStation) || [];
  return {
    distance,
    paths,
    bookingsList: bookings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStationsAction: (data) => dispatch(setStations(data)),
    setBookingsAction: (data) => dispatch(setBookings(data)),
    updateMarkerLocationAction: ({ lat, lng }) =>
      dispatch(updateMarkerLocation({ lat, lng })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Trip);
