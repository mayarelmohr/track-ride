import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { MemoryRouter } from "react-router-dom";
import Trip from "./index";
import { Provider } from "react-redux";
import { render, fireEvent } from "@testing-library/react";
import { store } from "../../configureStore";

const TripElement = (
  <Provider store={store}>
    <MemoryRouter>
      <Trip />
    </MemoryRouter>
  </Provider>
);

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("book ride button shows form", () => {
  const { getByTestId } = render(TripElement);
  const bookRideButton = getByTestId("book-ride-button");
  fireEvent.click(bookRideButton);
  expect(getByTestId("book-form"));
});

test("buttons are disabled after starting ride", () => {
  const { getByTestId } = render(TripElement);
  const startRideButton = getByTestId("start-ride-button");
  fireEvent.click(startRideButton);
  const bookRideButton = getByTestId("book-ride-button");
  expect(bookRideButton).toBeDisabled();
  expect(startRideButton).toBeDisabled();
});
