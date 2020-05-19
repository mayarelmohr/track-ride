import { combineReducers } from "redux";
import trip from "./trip";

export const initialState = {
  trip: {},
};

const allReducers = combineReducers({
  trip,
});

export const rootReducer = (state, action) => {
  return allReducers(state, action);
};
