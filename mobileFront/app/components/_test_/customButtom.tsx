import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CustomButton from "../ui/customButtom";

describe("CustomButton", () => {
  it("renders with given title and fires onPress", () => {
    const mockFn = jest.fn();
    const { getByText } = render(
      <CustomButton title="Click me" onPress={mockFn} />
    );

    const button = getByText("Click me");
    fireEvent.press(button);

    expect(button).toBeTruthy();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
