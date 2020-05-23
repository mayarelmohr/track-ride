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

test("Shows loading indicator", () => {
  const { container } = render(TripElement);
  expect(container.innerHTML).toMatch("Loading");
});

test("add snapshot for trip loading", () => {
  const { container, asFragment } = render(TripElement);
  expect(asFragment(container)).toMatchSnapshot();
});
