import { combineReducers } from "redux";
import trip from "./trip";

const allReducers = combineReducers({
  trip,
});

const rootReducer = (state, action) => {
  return allReducers(state, action);
};

export default rootReducer;
