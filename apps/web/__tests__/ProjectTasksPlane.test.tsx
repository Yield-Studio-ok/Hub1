import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProjectDetailsPage from "../app/projects/[id]/page";
import * as planeApi from "../lib/api/plane";
import "@testing-library/jest-dom";

const mockUser = {
  email: "admin@admin.com",
  getIdToken: jest.fn().mockResolvedValue("test-token"),
};

jest.mock("../lib/auth-context", () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

jest.mock("../lib/api", () => ({
  apiFetch: jest.fn().mockResolvedValue(null),
}));

jest.mock("../lib/api/plane", () => ({
  fetchPlaneStatus: jest.fn(),
  fetchProjectIssues: jest.fn(),
  createProjectIssue: jest.fn(),
}));

describe("ProjectDetailsPage Plane Tasks Integration", () => {
  const mockTickets: planeApi.PlaneIssue[] = [
    {
      id: "ticket-101",
      name: "Fix Authentication Flow",
      sequence_id: 88,
      priority: "high",
      state_detail: { name: "In Progress", group: "started" },
    },
    {
      id: "ticket-102",
      name: "Update Design System",
      sequence_id: 89,
      priority: "medium",
      state_detail: { name: "Todo", group: "unstarted" },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (planeApi.fetchPlaneStatus as jest.Mock).mockResolvedValue({
      isConfigured: true,
      workspaceSlug: "yield-studio-ok",
      apiUrl: "https://api.plane.so",
    });
    (planeApi.fetchProjectIssues as jest.Mock).mockResolvedValue(mockTickets);
  });

  it("loads and displays tickets from Plane in Tasks tab", async () => {
    render(<ProjectDetailsPage params={{ id: "3" }} />);

    // Click on Tasks tab
    const tasksTab = screen.getByRole("tab", { name: /Tareas|Tasks/i });
    fireEvent.click(tasksTab);

    // Verify tickets render
    await waitFor(() => {
      expect(screen.getByText("Fix Authentication Flow")).toBeInTheDocument();
      expect(screen.getByText("Update Design System")).toBeInTheDocument();
    });

    expect(screen.getByText("YLD-88")).toBeInTheDocument();
    expect(screen.getByText("YLD-89")).toBeInTheDocument();
  });

  it("opens create ticket modal and submits a new ticket", async () => {
    (planeApi.createProjectIssue as jest.Mock).mockResolvedValue({
      id: "ticket-103",
      name: "New Feature Ticket",
      sequence_id: 90,
      priority: "urgent",
      state_detail: { name: "Todo", group: "unstarted" },
    });

    render(<ProjectDetailsPage params={{ id: "3" }} />);

    const tasksTab = screen.getByRole("tab", { name: /Tareas|Tasks/i });
    fireEvent.click(tasksTab);

    await waitFor(() => {
      expect(screen.getByText("Fix Authentication Flow")).toBeInTheDocument();
    });

    // Open new ticket modal
    const newBtns = screen.getAllByRole("button", { name: /Nuevo Ticket/i });
    fireEvent.click(newBtns[0]);

    // Fill title
    const titleInput = screen.getByPlaceholderText(/Título de la tarea o issue/i);
    fireEvent.change(titleInput, { target: { value: "New Feature Ticket" } });

    // Click submit
    const submitBtn = screen.getByRole("button", { name: /Crear en Plane/i });
    const form = submitBtn.closest("form");
    if (form) {
      fireEvent.submit(form);
    } else {
      fireEvent.click(submitBtn);
    }

    await waitFor(() => {
      expect(planeApi.createProjectIssue).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ name: "New Feature Ticket" }),
        "test-token",
      );
      expect(screen.getByText("New Feature Ticket")).toBeInTheDocument();
    });
  });
});
