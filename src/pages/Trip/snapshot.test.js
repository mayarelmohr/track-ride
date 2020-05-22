import React from "react";
import { MemoryRouter } from "react-router-dom";
import Trip from "./index";
import { Provider } from "react-redux";
import { render, cleanup } from "@testing-library/react";
import { store } from "../../configureStore";

const TripElement = (
  <Provider store={store}>
    <MemoryRouter>
      <Trip />
    </MemoryRouter>
  </Provider>
);

afterEach(cleanup);

test("add snapshot for trip index page", () => {
  const { container, asFragment } = render(TripElement);
  expect(asFragment(container)).toMatchSnapshot();
});
