import TripReducer, { initialState, setStations } from "./trip";
import { OrderedMap } from "immutable";

describe("Trips Reducer", () => {
  it("should return the initial state", () => {
    expect(TripReducer(undefined, {})).toEqual(initialState);
  });

  it("properly reads an empty array into ordered Map ", () => {
    expect(TripReducer(initialState, setStations([]))).toEqual({
      ...initialState,
      stations: new OrderedMap(),
    });
  });
  const initialObject = {
    station_id: "213",
    station_latitude: "29.99509712",
    station_longitude: "31.4459768",
    station_name: "Stop 1",
  };
  const expectedOutput = {
    id: "213",
    lat: 29.99509712,
    lng: 31.4459768,
    name: "Stop 1",
    bookings: [],
  };
  it("properly inserts an object into ordered Map of stations", () => {
    const output = TripReducer(initialState, setStations([initialObject]));
    expect(output.stations.has(initialObject.station_id)).toEqual(true);
  });
  it("properly sets the object format in stations", () => {
    const output = TripReducer(initialState, setStations([initialObject]));
    expect(output.stations.get(initialObject.station_id)).toEqual(
      expectedOutput
    );
  });
});
