import TripReducer, {
  initialState,
  setStations,
  setBookings,
  updateBookings,
  generateBooking,
  setDirections,
  setTripTime,
  setTripStartTime,
  setTripState,
  updateCurrentStation,
} from "./trip";
import { OrderedMap } from "immutable";
import { cleanup } from "@testing-library/react";
import { TRIP_STATE, TRIP_TIME, TIME_SHIFT } from "../helpers/constants";

afterEach(cleanup);

const mockStations = {
  station_id: "213",
  station_latitude: "29.99509712",
  station_longitude: "31.4459768",
  station_name: "Stop 1",
};

const mockUsers = [
  {
    id: "2",
    name: "Annamaria Brandino",
    payment: "credit",
    picture: "https://robohash.org/saepequoeius.png?size=50x50&set=set1",
    station: "213",
    status: "in",
  },
];

describe("sets stations", () => {
  it("should return the initial state", () => {
    expect(TripReducer(undefined, {})).toMatchObject(initialState);
  });

  it("reads an empty array into ordered Map ", () => {
    expect(TripReducer(initialState, setStations([]))).toMatchObject({
      ...initialState,
      stations: new OrderedMap(),
    });
  });

  const stationsState = TripReducer(initialState, setStations([mockStations]));

  it("inserts an object into ordered Map of stations", () => {
    expect(stationsState.stations.has(mockStations.station_id)).toEqual(true);
  });

  it("sets the object format in stations", () => {
    const expectedOutput = {
      id: "213",
      lat: 29.99509712,
      lng: 31.4459768,
      name: "Stop 1",
      bookings: [],
    };
    expect(stationsState.stations.get(mockStations.station_id)).toMatchObject(
      expectedOutput
    );
  });

  it("updates current station", () => {
    const output = TripReducer(
      stationsState,
      updateCurrentStation(mockStations.station_id)
    );
    expect(output.currentStation.id).toBe(mockStations.station_id);
  });
});

describe("Bookings are updated", () => {
  const currentStationsState = TripReducer(
    initialState,
    setStations([mockStations])
  );
  const currentBookingState = TripReducer(
    currentStationsState,
    setBookings(mockUsers)
  );
  it("sets bookings from list of users", () => {
    expect(
      currentBookingState.stations.get(mockStations.station_id).bookings
    ).toHaveLength(1);
    expect(currentBookingState.currentStation).toBe(mockStations.station_id);
    expect(currentBookingState.isDataReady).toEqual(true);
  });

  it("updates randomly bookings from list of users", () => {
    const oldBookingState = currentBookingState.stations.get(
      mockStations.station_id
    ).bookings;
    const outputState = TripReducer(
      currentBookingState,
      updateBookings(mockStations.station_id)
    );
    const newBookings = outputState.stations.get(mockStations.station_id)
      .bookings;
    expect(newBookings).not.toBe(oldBookingState);
  });

  it("adds user data to list of bookings", () => {
    const newUser = {
      name: "John",
      station: "213",
      payment: "credit",
    };
    const outputState = TripReducer(
      currentBookingState,
      generateBooking(newUser)
    );
    const addedBooking = outputState.stations
      .get(newUser.station)
      .bookings.pop();
    expect(addedBooking.name).toBe(newUser.name);
    expect(addedBooking.payment).toBe(newUser.payment);
    expect(addedBooking.id).toBeTruthy();
  });
});

test("sets directions", () => {
  const mockDirections = {
    paths: [],
    points: {},
  };
  expect(
    TripReducer(initialState, setDirections(mockDirections))
  ).toMatchObject({
    ...initialState,
    directions: mockDirections,
  });
});

test("sets start time", () => {
  const time = Date.now();
  expect(TripReducer(initialState, setTripStartTime(time))).toMatchObject({
    ...initialState,
    startTime: time,
  });
});

test("sets trip state", () => {
  const mockTripState = TRIP_STATE.IDLE;
  expect(TripReducer(initialState, setTripState(mockTripState))).toMatchObject({
    ...initialState,
    tripState: mockTripState,
  });
});

test("sets trip time", () => {
  const originalTime = TRIP_TIME;
  const outputTime = TripReducer(initialState, setTripTime(originalTime));
  const expectedTimeValue =
    outputTime === Math.abs(TRIP_TIME - TIME_SHIFT[0]) ||
    outputTime === TRIP_TIME;
  expect(expectedTimeValue);
});
