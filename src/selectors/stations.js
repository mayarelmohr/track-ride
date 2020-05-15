export const getOrigin = (stations) => {
  return stations[0];
};

export const getDestination = (stations) => {
  return stations[stations.length - 1];
};

export const getStationsBetweenStartAndEnd = (stations) => {
  const middleStations = stations.slice(1, -1);
  return middleStations;
};
