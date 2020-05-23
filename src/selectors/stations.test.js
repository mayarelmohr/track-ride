import {
  getStartPointSelector,
  getEndPointSelector,
  getStationsBetweenStartAndEndSelector,
  mapDirectionsToPathSelector,
  getDistanceSelector,
  getAvailableStationsSelector,
} from "./stations";
import { mockedDirections, mockedStations } from "../tests/mockData";

describe("Stations Selectors", () => {
  const mockedStationsMap = mockedStations();
  it("get first station from state", () => {
    const output = getStartPointSelector.resultFunc(mockedStationsMap);
    expect(output.name).toBe("Stop 1");
  });

  it("get last station from state", () => {
    const output = getEndPointSelector.resultFunc(mockedStationsMap);
    expect(output.name).toBe("Stop 4");
  });

  it("get middle stations from state", () => {
    const output = getStationsBetweenStartAndEndSelector.resultFunc(
      mockedStationsMap
    );
    expect(output).toHaveLength(2);
  });

  it("get path from directions object", () => {
    const output = mapDirectionsToPathSelector.resultFunc(
      mockedStationsMap,
      mockedDirections
    );
    expect(output).toHaveLength(4);
    expect(output[0].stationId).toBeTruthy();
    expect(output[0].lng).toBeGreaterThan(0);
  });

  it("get distance from directions object", () => {
    const output = getDistanceSelector.resultFunc(mockedDirections);
    expect(output).toBeGreaterThan(0);
  });
  it("gets available stations", () => {
    const output = getAvailableStationsSelector.resultFunc(mockedStationsMap);
    expect(output.toArray()).toHaveLength(2);
  });
});
