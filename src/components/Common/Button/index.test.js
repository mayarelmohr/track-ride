import React from "react";
import Button from "./index";

import { render, fireEvent } from "@testing-library/react";

test("Button text is displayed correctly", () => {
  const testText = "Testing Button";
  const { container } = render(<Button text={testText} disabled={true} />);
  expect(container).toHaveTextContent(testText);
});

test("Button is disabled", () => {
  const testText = "Testing Button";
  const { getByText } = render(<Button text={testText} disabled={true} />);
  const button = getByText(testText);
  expect(button).toBeDisabled();
});

test("Button action is called", () => {
  const testText = "Testing Button";
  const action = jest.fn();
  const { getByText } = render(<Button text={testText} action={action} />);
  const button = getByText(testText);
  fireEvent.click(button);
  expect(action).toHaveBeenCalledTimes(1);
});
