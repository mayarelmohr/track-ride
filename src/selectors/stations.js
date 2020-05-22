import { BOOK_LIMIT } from "../helpers/constants";
export const getStartPoint = (stations) => {
  const stationsArray = stations.valueSeq().toArray();
  return stationsArray[0];
};

export const getEndPoint = (stations) => {
  const stationsArray = stations.valueSeq().toArray();
  return stationsArray[stationsArray.length - 1];
};

export const getStationsBetweenStartAndEnd = (stations) => {
  const stationsArray = stations.valueSeq().toArray();
  const middleStations = stationsArray.slice(1, -1);
  return middleStations;
};

export const mapDirectionsToPath = (directions, stations) => {
  if (!directions.routes) {
    return [];
  }
  const { legs } = directions.routes[0];
  /**
   * This function returns an array of lats and lngs from
   * direction object returned from google maps API
   * It also sets the station id to object to make it easier to update
   * the station location whne captain moves
   */
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
};

export const getPathsCount = (paths) => {
  return paths.reduce((acc, val) => {
    acc += val.length;
    return acc;
  }, 0);
};

export const getDistance = (directions) => {
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
};

export const getAvailableStations = (stations) => {
  return stations.filter((station) => {
    return station.bookings.length < BOOK_LIMIT;
  });
};

export const getCurrentStationFromLatAndLng = (stations, key = 0) => {};
