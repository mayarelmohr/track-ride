import React from "react";
import User from "./user";
import Booking from "./index";
import { render } from "@testing-library/react";

const mockBooking = [
  {
    id: 123,
    name: "John Doe",
    picture: "https://robohash.org/1234?size=50x50",
    station: "213",
    payment: "credit",
    status: "in",
  },
];

test("Shows user data correctly", () => {
  const { getByTestId, getByAltText } = render(
    <User booking={mockBooking[0]} />
  );
  const user = getByTestId("user");
  expect(user).toHaveTextContent("checked in");
  expect(user).toHaveTextContent(/213/);
  const image = getByAltText("John Doe");
  expect(image);
});

test("Shows Booking data", () => {
  const { getAllByTestId } = render(<Booking bookingsList={mockBooking} />);
  const bookingItem = getAllByTestId("user");
  expect(bookingItem).toHaveLength(1);
});

test("add snapshot for user", () => {
  const { container, asFragment } = render(<User booking={mockBooking[0]} />);
  expect(asFragment(container)).toMatchSnapshot();
});

test("add snapshot for booking", () => {
  const { container, asFragment } = render(
    <Booking bookingsList={mockBooking} />
  );
  expect(asFragment(container)).toMatchSnapshot();
});
