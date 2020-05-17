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

const Trip = (props) => {
  const [isLoading, setLoading] = useState(true);
  const [isBookRideFormVisible, setBookRideFormVisibility] = useState(false);
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
              updateLocation();
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
