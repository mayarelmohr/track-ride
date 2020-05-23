import {
  getStartPointSelector,
  getEndPointSelector,
  getStationsBetweenStartAndEndSelector,
  mapDirectionsToPathSelector,
  getDistanceSelector,
} from "./stations";
import { OrderedMap } from "immutable";
import { mockedDirections } from "../tests/mockData";

describe("Stations Selectors", () => {
  let mockedStations = new OrderedMap();
  mockedStations = mockedStations.set("213", { name: "Stop 1" });
  mockedStations = mockedStations.set("214", { name: "Stop 2" });
  mockedStations = mockedStations.set("215", { name: "Stop 3" });
  mockedStations = mockedStations.set("216", { name: "Stop 4" });

  it("get first station from state", () => {
    const output = getStartPointSelector.resultFunc(mockedStations);
    expect(output.name).toBe("Stop 1");
  });

  it("get last station from state", () => {
    const output = getEndPointSelector.resultFunc(mockedStations);
    expect(output.name).toBe("Stop 4");
  });

  it("get middle stations from state", () => {
    const output = getStationsBetweenStartAndEndSelector.resultFunc(
      mockedStations
    );
    expect(output).toHaveLength(2);
  });

  it("get path from directions object", () => {
    const output = mapDirectionsToPathSelector.resultFunc(
      mockedStations,
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
});
