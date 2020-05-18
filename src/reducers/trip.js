import { createAction, createReducer } from "redux-act";
import { OrderedMap } from "immutable";
import generateBookingData from "../helpers/generateBooking";
import { TIME_SHIFT, TRIP_STATE } from "../helpers/constants";

const initialState = {
  stations: new OrderedMap(),
  directions: null,
  currentMarkerPosition: null,
  currentStation: "",
  isMapReady: false,
  isDataReady: false,
  tripState: TRIP_STATE.IDLE,
};

export const setStations = createAction("Stations: set stations");
export const setBookings = createAction("Bookings: set bookings");
export const generateBooking = createAction("Bookings: generate booking");
export const setDirections = createAction("Directions: set Directions");
export const updateMarkerPosition = createAction(
  "Location: update current location"
);
export const setTripTime = createAction("Time: set trip time");

export const setTripState = createAction("Trip: set current state");

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
      if (!OrderedMap.isOrderedMap(stations)) {
        stations = new OrderedMap(stations);
      }
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
        isMapReady: true,
      };
    },
    [updateMarkerPosition]: (state, location) => ({
      ...state,
      currentMarkerPosition: { lat: location.lat, lng: location.lng },
    }),
    [setTripTime]: (state, time) => {
      const timeIndex = Math.floor(Math.random() * 3) + 1;
      return {
        ...state,
        tripTime: time + TIME_SHIFT[timeIndex - 1],
      };
    },
    [setTripState]: (state, newState) => {
      return {
        ...state,
        tripState: newState,
      };
    },
  },
  initialState
);
