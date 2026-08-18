import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders MERN Stack App heading", async () => {
  await act(async () => {
    render(<App />);
  });
  const heading = screen.getByText(/MERN Stack App/i);
  expect(heading).toBeInTheDocument();
});

test("renders Add Item button", async () => {
  await act(async () => {
    render(<App />);
  });
  const button = screen.getByTestId("submit-btn");
  expect(button).toBeInTheDocument();
  expect(button).toHaveTextContent("Add Item");
});

test("renders name input field", async () => {
  await act(async () => {
    render(<App />);
  });
  const input = screen.getByTestId("name-input");
  expect(input).toBeInTheDocument();
});

test("renders description input field", async () => {
  await act(async () => {
    render(<App />);
  });
  const input = screen.getByTestId("desc-input");
  expect(input).toBeInTheDocument();
});

test("shows empty message when no items", async () => {
  await act(async () => {
    render(<App />);
  });
  const emptyMsg = screen.getByTestId("empty-message");
  expect(emptyMsg).toHaveTextContent("No items yet.");
});

test("calls fetch on mount", async () => {
  await act(async () => {
    render(<App />);
  });
  expect(global.fetch).toHaveBeenCalledTimes(1);
});
