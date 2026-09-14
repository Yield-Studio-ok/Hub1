import { render, screen, waitFor } from "@testing-library/react";
import ActiveProjectsWidget from "../components/dashboard/ActiveProjectsWidget";
import { fetchActiveProjects } from "../lib/api/projects";

jest.mock("../lib/api/projects", () => ({
  fetchActiveProjects: jest.fn(),
}));

describe("ActiveProjectsWidget", () => {
  it("renders a loading skeleton initially", () => {
    (fetchActiveProjects as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<ActiveProjectsWidget />);
    expect(screen.getByTestId("projects-skeleton")).toBeInTheDocument();
  });

  it("renders project data after loading", async () => {
    (fetchActiveProjects as jest.Mock).mockResolvedValue([
      {
        id: "1",
        name: "Hub",
        latestRelease: "v1.0.0",
        deployStatus: "READY",
      },
    ]);
    render(<ActiveProjectsWidget />);

    await waitFor(() => {
      expect(screen.getByText("Hub")).toBeInTheDocument();
      expect(screen.getByText("v1.0.0")).toBeInTheDocument();
      expect(screen.getByText("READY")).toBeInTheDocument();
    });
  });
});
