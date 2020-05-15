import { createAction, createReducer } from "redux-act";

const initialState = {
  stations: [],
};

export const setStations = createAction("Stations: set stations");

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
  },
  initialState
);
