import React from "react";
import { render } from "@testing-library/react-native";
import { IndexContent } from "./index";
import { useCharacterStore } from "@/store/character-store";
import { useAccountStore } from "@/store/account-store";
import Index from "./index";

// Define a type for mocked functions
type MockedFunction = jest.Mock<any, any>;

// Mock the store hooks
jest.mock("@/store/character-store", () => ({
  useCharacterStore: jest.fn(),
}));

jest.mock("@/store/account-store", () => ({
  useAccountStore: jest.fn(),
}));

describe("IndexContent Component", () => {
  it("renders loading indicator when character is undefined", () => {
    const { getByTestId } = render(
      <IndexContent character={undefined} account={{}} />
    );

    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("renders loading indicator when account is undefined", () => {
    const { getByTestId } = render(
      <IndexContent character={{}} account={undefined} />
    );

    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("renders loading indicator when both character and account are undefined", () => {
    const { getByTestId } = render(
      <IndexContent character={undefined} account={undefined} />
    );

    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("renders null when both character and account are defined", () => {
    const result = render(<IndexContent character={{}} account={{}} />);

    // When a component returns null, the loading indicator shouldn't exist
    expect(() => result.getByTestId("loading-indicator")).toThrow();
  });
});

describe("Index Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("renders loading indicator when stores return undefined", () => {
    // Mock the store hooks to return undefined values
    (useCharacterStore as unknown as MockedFunction).mockImplementation(
      (selector) => {
        return selector({ character: undefined });
      }
    );

    (useAccountStore as unknown as MockedFunction).mockImplementation(
      (selector) => {
        return selector({ account: undefined });
      }
    );

    const { getByTestId } = render(<Index />);
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("renders null when stores return defined values", () => {
    // Mock the store hooks to return defined values
    (useCharacterStore as unknown as MockedFunction).mockImplementation(
      (selector) => {
        return selector({ character: { name: "Test Character" } });
      }
    );

    (useAccountStore as unknown as MockedFunction).mockImplementation(
      (selector) => {
        return selector({ account: { id: "123" } });
      }
    );

    const result = render(<Index />);

    // When a component returns null, the loading indicator shouldn't exist
    expect(() => result.getByTestId("loading-indicator")).toThrow();
  });

  it("extracts the correct data from store states", () => {
    // Create spy functions to capture the selector functions
    const characterSelectorSpy = jest.fn();
    const accountSelectorSpy = jest.fn();

    // Mock the store hooks to capture the selector functions
    (useCharacterStore as unknown as MockedFunction).mockImplementation(
      (selector) => {
        characterSelectorSpy(selector);
        return selector({ character: { name: "Test Character" } });
      }
    );

    (useAccountStore as unknown as MockedFunction).mockImplementation(
      (selector) => {
        accountSelectorSpy(selector);
        return selector({ account: { id: "123" } });
      }
    );

    render(<Index />);

    // Get the first call's first argument (the selector function)
    const characterSelector = characterSelectorSpy.mock.calls[0][0];
    const accountSelector = accountSelectorSpy.mock.calls[0][0];

    // Test that the selectors extract the correct properties
    const mockCharacterState = { character: { name: "Test Character" } };
    const mockAccountState = { account: { id: "123" } };

    expect(characterSelector(mockCharacterState)).toEqual({
      name: "Test Character",
    });
    expect(accountSelector(mockAccountState)).toEqual({ id: "123" });
  });
});
