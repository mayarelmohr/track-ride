import React from "react";
import TripInfo from "./index";

import { render } from "@testing-library/react";

test("Shows time and distance correctly", () => {
  const time = 120000;
  const distance = 45;
  const { getByTestId } = render(<TripInfo distance={distance} time={time} />);
  const tripInfoElement = getByTestId("trip-info");
  expect(tripInfoElement).toHaveTextContent(distance);
  const expectedTime = 120000 / 1000;
  expect(tripInfoElement).toHaveTextContent(expectedTime);
});
