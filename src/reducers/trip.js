import { createAction, createReducer } from "redux-act";

const initialState = {
  stations: [],
  directions: {},
  currentLocation: {},
};

export const setStations = createAction("Stations: set stations");
export const setDirections = createAction("Directions: set Directions");
export const updateMarkerLocation = createAction(
  "Location: update current location"
);

export default createReducer(
  {
    [setStations]: (state, routes) => {
      const stations = routes.map((route) => {
        return {
          id: Number(route["station_id"]),
          lat: Number(route["station_latitude"]),
          lng: Number(route["station_longitude"]),
          name: route["station_name"],
        };
      });
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
    [updateMarkerLocation]: (state, location) => ({
      ...state,
      currentLocation: location,
    }),
  },
  initialState
);
