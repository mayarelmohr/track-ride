import { createAction, createReducer } from "redux-act";
import { OrderedMap } from "immutable";
import {
  generateBookingStatus,
  generateUserData,
} from "../helpers/generateBooking";
import { TIME_SHIFT, TRIP_STATE } from "../helpers/constants";

export const initialState = {
  stations: new OrderedMap(),
  directions: {},
  currentStation: null,
  isDataReady: false,
  tripState: TRIP_STATE.IDLE,
  startTime: null,
  paths: [],
};

export const setStations = createAction("Stations: set stations");
export const setBookings = createAction("Bookings: set bookings");
export const updateBookings = createAction("Station: update Bookings");
export const generateBooking = createAction("Bookings: generate booking");
export const setDirections = createAction("Directions: set Directions");
export const setTripState = createAction("Trip: set current state");
export const setTripTime = createAction("Time: set trip time");
export const setTripStartTime = createAction(
  "Time: save time of when trip started"
);
export const updateCurrentStation = createAction(
  "Station: update the current station"
);

export default createReducer(
  {
    [setStations]: (state, routes) => {
      /** read from routes csv and saves it store */
      let { stations } = state;
      routes.forEach((route) => {
        const id = route["station_id"];
        stations = stations.set(id, {
          lat: Number(route["station_latitude"]),
          lng: Number(route["station_longitude"]),
          name: route["station_name"],
          bookings: [],
          id,
        });
      });

      return {
        ...state,
        stations,
      };
    },
    [setBookings]: (state, users) => {
      /** read from users csv and saves them to their respective stations */
      let { stations } = state;
      debugger;
      users.forEach((user) => {
        const { station: stationId } = user;
        const stationData = stations.get(stationId);
        stationData.bookings.push(user);
        stations = stations.set(stationId, stationData);
      });
      const stationsKeys = stations.keySeq().toArray();
      return {
        ...state,
        stations,
        currentStation: stationsKeys[0],
        isDataReady: true,
      };
    },
    [updateBookings]: (state, id) => {
      /** On reaching a station
       * it randomizes the booking status for the passengers
       * and updates bookings for this station */
      let { stations } = state;
      let stationData = stations.get(id);
      let updatedBooking = generateBookingStatus(stationData.bookings);
      stations = stations.set(id, {
        ...stationData,
        ...{ bookings: updatedBooking },
      });

      return {
        ...state,
        stations,
      };
    },
    [generateBooking]: (state, data) => {
      /** Adds a new booking from add passenger form
       * The id is randomly generated
       * Picture is requested based on id
       */
      let { stations } = state;
      const { station: stationId } = data;
      const stationData = stations.get(stationId);
      const userId =
        Math.floor(Math.random() * 10000) +
        100; /** Added 100 to avoid duplicating ids from csv */
      const generatedData = generateUserData(userId);
      stationData.bookings.push({ ...data, ...generatedData });
      stations = stations.set(stationId, stationData);
      return {
        ...state,
        stations,
      };
    },
    [setDirections]: (state, directions) => {
      return {
        ...state,
        directions,
      };
    },
    [setTripTime]: (state, time) => {
      /** Time of trip is set from random value from time shift array
       * It can be +30 sec or +0 or -30sec
       */
      const timeIndex = Math.floor(Math.random() * 3) + 1;
      return {
        ...state,
        tripTime: time + TIME_SHIFT[timeIndex - 1],
      };
    },
    [setTripStartTime]: (state, time) => {
      return {
        ...state,
        startTime: time,
      };
    },
    [setTripState]: (state, tripState) => ({
      ...state,
      tripState: tripState,
    }),
    [updateCurrentStation]: (state, id) => {
      const { stations } = state;
      const currentStation = stations.get(id);
      return {
        ...state,
        currentStation,
      };
    },
  },
  initialState
);
