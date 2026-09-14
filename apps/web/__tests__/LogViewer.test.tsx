import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LogViewer } from "../components/log-viewer";
import "@testing-library/jest-dom";

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("LogViewer", () => {
  beforeEach(() => {
    (navigator.clipboard.writeText as jest.Mock).mockClear();
  });

  it("renders the provided logs", () => {
    render(<LogViewer logs="Error: connection failed\nRetrying..." />);
    expect(screen.getByText(/Error: connection failed/)).toBeInTheDocument();
    expect(screen.getByText(/Retrying\.\.\./)).toBeInTheDocument();
  });

  it("copies logs to clipboard when copy button is clicked", async () => {
    render(<LogViewer logs="System started successfully" />);

    const copyButton = screen.getByRole("button", { name: /copy logs/i });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("System started successfully");
  });

  it("renders fallback text if no logs provided", () => {
    render(<LogViewer logs="" />);
    expect(screen.getByText(/No logs available/i)).toBeInTheDocument();
  });
});
