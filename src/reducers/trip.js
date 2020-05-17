import { createAction, createReducer } from "redux-act";
import { OrderedMap } from "immutable";

const initialState = {
  stations: new OrderedMap(),
  directions: {},
  currentLocation: {},
  currentStation: "",
};

export const setStations = createAction("Stations: set stations");
export const setBookings = createAction("Bookings: set bookings");
export const setDirections = createAction("Directions: set Directions");
export const updateMarkerLocation = createAction(
  "Location: update current location"
);

export default createReducer(
  {
    [setStations]: (state, routes) => {
      let { stations } = state;
      routes.map(
        (route) =>
          (stations = stations.set(Number(route["station_id"]), {
            lat: Number(route["station_latitude"]),
            lng: Number(route["station_longitude"]),
            name: route["station_name"],
            bookings: [],
          }))
      );
      return {
        ...state,
        stations,
      };
    },
    [setBookings]: (state, users) => {
      let { stations } = state;
      users.map((user) => {
        const stationId = Number(user.station);
        const stationData = stations.get(Number(stationId));
        stationData.bookings.push(user);
        stations = stations.set(stationId, stationData);
      });
      const stationsKeys = stations.keySeq().toArray();
      return {
        ...state,
        stations,
        currentStation: stationsKeys[0],
      };
    },
    [setDirections]: (state, directions) => {
      return {
        ...state,
        directions,
      };
    },
    [updateMarkerLocation]: (state, location) => ({
      ...state,
      currentLocation: location,
    }),
  },
  initialState
);
