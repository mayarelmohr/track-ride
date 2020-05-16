export const getOrigin = (stations = []) => {
  return stations[0];
};

export const getDestination = (stations = []) => {
  return stations[stations.length - 1];
};

export const getStationsBetweenStartAndEnd = (stations = []) => {
  const middleStations = stations.slice(1, -1);
  return middleStations;
};

export const getStationsPath = (directions) => {
  if (!directions.routes) {
    return [];
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
