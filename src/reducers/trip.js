import { createAction, createReducer } from "redux-act";
import { OrderedMap } from "immutable";
import generateBookingData from "../helpers/generateBooking";
import { TIME_SHIFT } from "../helpers/constants";

const initialState = {
  stations: new OrderedMap(),
  directions: {},
  currentLocation: {},
  currentStation: "",
  isDataReady: false,
};

export const setStations = createAction("Stations: set stations");
export const setBookings = createAction("Bookings: set bookings");
export const generateBooking = createAction("Bookings: generate booking");
export const setDirections = createAction("Directions: set Directions");
export const updateMarkerLocation = createAction(
  "Location: update current location"
);
export const setTripTime = createAction("Time: set trip time");

export default createReducer(
  {
    [setStations]: (state, routes) => {
      let { stations } = state;
      if (!OrderedMap.isOrderedMap(stations)) {
        stations = new OrderedMap(stations);
      }
      routes.map((route) => {
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
      users.map((user) => {
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
    [generateBooking]: (state, data) => {
      let { stations } = state;
      const { station: stationId } = data;
      const stationData = stations.get(stationId);
      const userId =
        Math.floor(Math.random() * 10000) +
        100; /** Added 100 to avoid duplicating ids from csv */
      const generatedData = generateBookingData(userId);
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
        isReady: true,
      };
    },
    [updateMarkerLocation]: (state, location) => ({
      ...state,
      currentLocation: location,
    }),
    [setTripTime]: (state, time) => {
      const timeIndex = Math.floor(Math.random() * 3) + 1;
      return {
        ...state,
        tripTime: time + TIME_SHIFT[timeIndex - 1],
      };
    },
  },
  initialState
);
