import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./configureStore";
import App from "./App";

afterEach(cleanup);

test("navigates home when you click the logo", () => {
  const { container, getByTestId } = render(
    <MemoryRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </MemoryRouter>
  );
  const link = getByTestId("home");
  fireEvent.click(link);
  expect(container.innerHTML).toMatch("Loading");
});
