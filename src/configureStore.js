import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import localForage from "localforage";
import rootReducer from "./reducers";
import { OrderedMap } from "immutable";
import { createTransform } from "redux-persist";

const SetTransform = createTransform(
  (inboundState) => {
    return { ...inboundState, stations: inboundState.stations.toArray() };
  },
  (outboundState) => {
    return {
      ...outboundState,
      stations: new OrderedMap(outboundState.stations),
    };
  },
  { whitelist: ["trip"] }
);

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */
const persistConfig = {
  key: "0.1.1",
  storage: localForage,
  whitelist: ["trip"],
  transforms: [SetTransform],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const configureStore = (initialState = {}) => {
  const store = createStore(
    persistedReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  );
  const persistor = persistStore(store);
  return { store, persistor };
};

export const { store, persistor } = configureStore(window.REDUX_STATE || {});
