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
  currentStationPosition: {},
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
      debugger;
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
      let { stations } = state;
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
    [updateBookings]: (state, index) => {
      let { stations } = state;
      let currentStation = stations.toArray()[index];
      let id = currentStation[0];
      let stationData = stations.get(id);
      let updatedBooking = generateBookingStatus(stationData.bookings);
      stations = stations.set(id, {
        ...stationData,
        ...{ bookings: updatedBooking },
      });

      return {
        ...state,
        stations,
        currentStation: id,
        currentStationPosition: stationData,
      };
    },
    [generateBooking]: (state, data) => {
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
    [updateCurrentStation]: (state, stationIndex) => {
      const { stations } = state;
      const currentStation = stations.valueSeq().toArray[stationIndex];
      return {
        ...state,
        currentStation,
      };
    },
  },
  initialState
);
