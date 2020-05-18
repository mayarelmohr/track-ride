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

export const getStationsPath = (directions) => {
  if (!directions) {
    return [[]];
  }
  const { legs } = directions.routes[0];
  return legs.reduce((acc, val) => {
    let pathPerStop = [];
    val.steps.forEach((step) => {
      pathPerStop.push(step.path);
    });
    acc.push(pathPerStop.flat());
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
  if (!directions) {
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

export const calculateStopDurationPerStepInPath = (
  stations,
  paths,
  totalTime,
  stopTimePerStation
) => {
  const stepsCount = getPathsCount(paths);
  const stationsCount = stations.toArray().length;
  const totalTimeDurationStation = stationsCount * stopTimePerStation;
  const totalTimeDurationSteps = totalTime - totalTimeDurationStation;
  const timePerStep = totalTimeDurationSteps / stepsCount;
  return timePerStep;
};
