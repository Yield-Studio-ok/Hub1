import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TimeLogsPage from "../app/dashboard/time-logs/page";
import "@testing-library/jest-dom";

// Mock the API fetch
jest.mock("../lib/api", () => ({
  apiFetch: jest.fn(() => Promise.resolve({ 
    success: true, 
    data: [
      { id: "log-1", projectId: "proj-1", ticketId: "tick-1", durationSeconds: 3600, userId: "user-1", createdAt: new Date().toISOString() }
    ]
  }))
}));

// Mock the auth context
jest.mock("../lib/auth-context", () => ({
  useAuth: () => ({ user: { getIdToken: () => Promise.resolve("token") } })
}));

describe("TimeLogsPage", () => {
  it("renders correctly with mocked data", async () => {
    render(<TimeLogsPage />);
    
    // Check heading
    expect(screen.getByText("Time Logs (Admin)")).toBeInTheDocument();
    
    // Wait for the table to load data
    await waitFor(() => {
      expect(screen.getByLabelText("Time Logs Table")).toBeInTheDocument();
    });
    
    // Check if mocked data is in the table
    expect(screen.getByText("log-1")).toBeInTheDocument();
    expect(screen.getByText("user-1")).toBeInTheDocument();
    expect(screen.getByText("1h 0m 0s")).toBeInTheDocument();
  });
});
