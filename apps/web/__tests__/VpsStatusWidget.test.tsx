import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import VpsStatusWidget from "../components/dashboard/VpsStatusWidget";

// Mock fetch
global.fetch = jest.fn();

describe("VpsStatusWidget", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders loading state initially", () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<VpsStatusWidget />);
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders VPS status data successfully", async () => {
    const mockData = {
      cpuUsage: 45.2,
      freeRam: 2048,
      topProcesses: [
        { name: "node", cpu: 10.5, mem: 5.2 },
        { name: "docker", cpu: 2.1, mem: 1.1 },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    render(<VpsStatusWidget />);

    await waitFor(() => {
      expect(screen.getByText(/45.2%/)).toBeInTheDocument();
      expect(screen.getByText(/2048 MB/)).toBeInTheDocument();
      expect(screen.getByText("node")).toBeInTheDocument();
      expect(screen.getByText("docker")).toBeInTheDocument();
    });
  });

  it("renders error state on failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    render(<VpsStatusWidget />);

    await waitFor(() => {
      expect(screen.getByText(/error al cargar/i)).toBeInTheDocument();
    });
  });
});
