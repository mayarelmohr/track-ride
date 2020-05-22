import React from "react";
import { MemoryRouter } from "react-router-dom";
import Trip from "./index";

import { Provider } from "react-redux";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { store } from "../../configureStore";

const TripElement = (
  <Provider store={store}>
    <MemoryRouter>
      <Trip />
    </MemoryRouter>
  </Provider>
);

afterEach(() => {
  cleanup();
}); // Default on import: runs it after each test.

it("start ride button is disabled after click", () => {
  const { getByTestId } = render(TripElement);
  const button = getByTestId("start-ride-button");
  fireEvent.click(button);
  const bookRideButton = getByTestId("book-ride-button");
  expect(bookRideButton).toBeDisabled();
  expect(button).toBeDisabled();
  cleanup();
});

it("book ride button shows form", () => {
  const { getByTestId } = render(TripElement);
  const bookRideButton = getByTestId("book-ride-button");
  fireEvent.click(bookRideButton);
  expect(getByTestId("book-form"));
});
