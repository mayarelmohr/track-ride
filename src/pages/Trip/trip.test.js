// counter.test.js
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import Trip from "./index";
import { Provider } from "react-redux";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { store } from "../../configureStore";

afterEach(cleanup);

test("can render with redux with defaults", () => {
  const { debug, getByText } = render(
    <Provider store={store}>
      <Trip />
    </Provider>
  );
  const button = getByText("Start ride");
  fireEvent.click(button);
  debug();
});

test("snapshot trip 1", () => {
  const tripElement = render(
    <Provider store={store}>
      <Trip />
    </Provider>
  );
  expect(tripElement).toMatchSnapshot();
});
