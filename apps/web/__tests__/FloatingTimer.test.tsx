import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FloatingTimer } from "../components/floating-timer";
import "@testing-library/jest-dom";

// Mock the API fetch
jest.mock("../lib/api", () => ({
  apiFetch: jest.fn(() => Promise.resolve({ success: true, data: [] })),
}));

// Mock the auth context
jest.mock("../lib/auth-context", () => ({
  useAuth: () => ({ user: { getIdToken: () => Promise.resolve("token") } }),
}));

describe("FloatingTimer", () => {
  it("renders TimerIcon initially when idle", () => {
    render(<FloatingTimer />);
    expect(screen.getByLabelText("Timer Icon")).toBeInTheDocument();
  });

  it("expands on hover and shows selects and timer", () => {
    render(<FloatingTimer />);

    // Hover over the container
    const container = screen.getByLabelText("Timer Icon").closest("div.fixed");
    if (container) fireEvent.mouseEnter(container);

    expect(screen.getByLabelText("Select Project")).toBeInTheDocument();
    expect(screen.getByLabelText("Select Ticket")).toBeInTheDocument();
    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(screen.getByLabelText("Play")).toBeInTheDocument();
    expect(screen.getByLabelText("Stop")).toBeInTheDocument();
  });
});
