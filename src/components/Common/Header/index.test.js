import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import Header from "./index";

const headerElement = (
  <MemoryRouter>
    <Header />
  </MemoryRouter>
);

test("header renders correctly", () => {
  const { getByAltText } = render(headerElement);
  const logo = getByAltText("swvl");
  expect(logo).toBeTruthy();
});

test("it renders ", () => {
  const { asFragment } = render(headerElement);
  expect(asFragment()).toMatchSnapshot();
});
