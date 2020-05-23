import {
  getBookingStatusSelector,
  getPaymentInfoPerStationSelector,
  getStationNamesSelector,
  getBookingsCountPerStationSelector,
} from "./statistics";
import { mockedStations } from "../tests/mockData";

describe("Statistics Selectors", () => {
  const mockedStationsMap = mockedStations();
  it("get booking status", () => {
    const output = getBookingStatusSelector.resultFunc(mockedStationsMap);
    const expectedOutput = { in: 24, out: 6, missed: 0 };
    expect(output).toMatchObject(expectedOutput);
  });
  it("get payment info are right", () => {
    const output = getPaymentInfoPerStationSelector.resultFunc(
      mockedStationsMap
    );
    const expectedOutput = { credit: [0, 6, 0, 0], cash: [12, 0, 0, 12] };
    expect(output).toMatchObject(expectedOutput);
  });
  it("get station names", () => {
    const output = getStationNamesSelector.resultFunc(mockedStationsMap);
    const expectedOutput = ["Stop 1", "Stop 2", "Stop 3", "Stop 4"];
    expect(output).toMatchObject(expectedOutput);
  });

  it("gets booking count per stations", () => {
    const output = getBookingsCountPerStationSelector.resultFunc(
      mockedStationsMap
    );
    const expectedOutput = [12, 6, 0, 12];
    expect(output).toMatchObject(expectedOutput);
  });
});
