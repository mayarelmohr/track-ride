import { createSelector } from "reselect";
import { stationsSelector, directionsSelector } from "./selectors";
import { BOOK_LIMIT } from "../helpers/constants";

export const getStartPointSelector = createSelector(
  stationsSelector,
  (stations) => {
    /** Returns first station in route */
    const stationsArray = stations.valueSeq().toArray();
    return stationsArray[0];
  }
);

export const getEndPointSelector = createSelector(
  stationsSelector,
  (stations) => {
    /** Returns first station in route */
    const stationsArray = stations.valueSeq().toArray();
    return stationsArray[stationsArray.length - 1];
  }
);

export const getStationsBetweenStartAndEndSelector = createSelector(
  stationsSelector,
  (stations) => {
    /** Returns routes without the start and end point */
    const stationsArray = stations.valueSeq().toArray();
    const middleStations = stationsArray.slice(1, -1);
    return middleStations;
  }
);

export const mapDirectionsToPathSelector = createSelector(
  stationsSelector,
  directionsSelector,
  (stations, directions) => {
    /**
     * This function returns an array of lats and lngs from
     * direction object returned from google maps API
     * It also sets the station id to object to make it easier to update
     * the station location whem captain moves
     */
    if (!directions.routes) {
      return [];
    }
    const { legs } = directions.routes[0];
    const stationsArray = stations.keySeq().toArray();
    return legs.reduce((acc, leg, legIndex) => {
      leg.steps.forEach((step) => {
        step.path.forEach((point) => {
          let { lat, lng } = point;
          lat = typeof lat === "function" ? lat() : lat;
          lng = typeof lng === "function" ? lng() : lng;
          acc.push({ lat, lng, stationId: stationsArray[legIndex] });
        });
      });
      return acc;
    }, []);
  }
);

export const getDistanceSelector = createSelector(
  directionsSelector,
  (directions) => {
    /** get distance for all trip */
    if (!directions.routes) {
      return [];
    }
    const { legs } = directions.routes[0];
    const distance = legs.reduce((acc, val) => {
      const distance = val.distance.value;
      acc += distance;
      return acc;
    }, 0);
    return Math.round(distance / 1000);
  }
);

export const getAvailableStationsSelector = createSelector(
  stationsSelector,
  (stations) => {
    // get stations that have less than 12 passengers
    return stations
      .filter((station) => {
        return station.bookings.length < BOOK_LIMIT;
      })
      .valueSeq();
  }
);
