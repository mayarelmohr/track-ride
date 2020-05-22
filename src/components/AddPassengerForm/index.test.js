import React from "react";
import { AddPassengerToStationForm } from "./index";
import { render, fireEvent } from "@testing-library/react";

const mockStationsArray = [
  { lat: 30.01637555, lng: 31.39839364, name: "Stop 4", id: "216" },
  { lat: 30.0409879, lng: 31.34613896, name: "Stop 5", id: "217" },
  { lat: 30.04505095, lng: 31.34143553, name: "Stop 6", id: "218" },
  { lat: 30.05408947, lng: 31.3421715, name: "Stop 7", id: "219" },
  { lat: 30.06198228, lng: 31.34523262, name: "Stop 8", id: "220" },
  { lat: 30.07322503, lng: 31.34378507, name: "Stop 9", id: "221" },
  { lat: 30.08201257, lng: 31.34388217, name: "Stop 10", id: "222" },
];

const AddPassengerElement = (
  <AddPassengerToStationForm hasStations={true} availableStations={[]} />
);

test("Shows errors on when has stations is false", () => {
  const { container } = render(
    <AddPassengerToStationForm hasStations={false} availableStations={[]} />
  );
  expect(container).toHaveTextContent("Sorry, All stations are full");
});

test("Shows name error message", () => {
  const { getByTestId, getByText, container } = render(AddPassengerElement);
  const station = getByTestId("station");
  fireEvent.change(station, { target: { value: "213" } });
  const button = getByText("Add passenger");
  fireEvent.click(button);
  expect(button.type).toBe("submit");
  expect(container).toHaveTextContent("Please add name");
});

test("Shows station error message", () => {
  const { getByTestId, getByText, container } = render(AddPassengerElement);
  const name = getByTestId("name");
  fireEvent.change(name, { target: { value: "name" } });
  const button = getByText("Add passenger");
  fireEvent.click(button);
  expect(button.type).toBe("submit");
  expect(container).toHaveTextContent("Please add station");
});

test("Stations are rendered correctly", () => {
  const { getAllByTestId } = render(
    <AddPassengerToStationForm
      hasStations={true}
      availableStations={mockStationsArray}
    />
  );
  const options = getAllByTestId("option");
  expect(options).toHaveLength(mockStationsArray.length);
});

test("add snapshot for add passenger form", () => {
  const { container, asFragment } = render(
    <AddPassengerToStationForm hasStations={true} availableStations={[]} />
  );
  expect(asFragment(container)).toMatchSnapshot();
});
