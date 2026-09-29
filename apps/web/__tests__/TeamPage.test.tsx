import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TeamPage from "../app/team/page";
import { apiFetch } from "../lib/api";
import "@testing-library/jest-dom";

// Mock apiFetch
jest.mock("../lib/api", () => ({
  apiFetch: jest.fn(),
  ApiError: class ApiError extends Error {
    constructor(
      message: string,
      readonly status: number,
    ) {
      super(message);
    }
  },
}));

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

const MOCK_API_MEMBERS = [
  {
    id: "mem-101",
    name: "Carlos Mendez",
    email: "carlos@yieldstudio.io",
    role: "Developer",
    status: "active",
    initials: "CM",
    joinedDate: "Febrero 2025",
    lastActive: "Hace 5 min",
  },
  {
    id: "mem-102",
    name: "Ana Gomez",
    email: "ana@yieldstudio.io",
    role: "Admin",
    status: "active",
    initials: "AG",
    joinedDate: "Marzo 2025",
    lastActive: "Hace 10 min",
  },
  {
    id: "mem-103",
    name: "Lucia Fernandez",
    email: "lucia@yieldstudio.io",
    role: "Designer",
    status: "offline",
    initials: "LF",
    joinedDate: "Abril 2025",
    lastActive: "Ayer",
  },
];

describe("TeamPage (Ticket 10.2 ABM de Equipo)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads team members from GET /api/team on mount and updates stats", async () => {
    mockApiFetch.mockResolvedValueOnce(MOCK_API_MEMBERS);

    render(<TeamPage />);

    // Initially or after API call, Carlos Mendez should appear
    await waitFor(() => {
      expect(mockApiFetch).toHaveBeenCalledWith("/api/team");
      expect(screen.getByText("Carlos Mendez")).toBeInTheDocument();
      expect(screen.getByText("Ana Gomez")).toBeInTheDocument();
      expect(screen.getByText("Lucia Fernandez")).toBeInTheDocument();
    });

    // Check stats: 3 total, 2 active, 1 admin
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("falls back to INITIAL_MEMBERS when GET /api/team fails", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Network / API Error"));

    render(<TeamPage />);

    await waitFor(() => {
      expect(mockApiFetch).toHaveBeenCalledWith("/api/team");
      // Leandro Carrasco is in INITIAL_MEMBERS
      expect(screen.getByText("Leandro Carrasco")).toBeInTheDocument();
    });
  });

  it("filters members by search query and role filter", async () => {
    mockApiFetch.mockResolvedValueOnce(MOCK_API_MEMBERS);

    render(<TeamPage />);

    await waitFor(() => {
      expect(screen.getByText("Carlos Mendez")).toBeInTheDocument();
    });

    // Search for Carlos
    const searchInput = screen.getByPlaceholderText(/Buscar por nombre, email o rol/i);
    fireEvent.change(searchInput, { target: { value: "Carlos" } });

    expect(screen.getByText("Carlos Mendez")).toBeInTheDocument();
    expect(screen.queryByText("Ana Gomez")).not.toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: "" } });

    // Filter by Admin role
    const adminFilterBtn = screen.getByRole("button", { name: "Admin" });
    fireEvent.click(adminFilterBtn);

    expect(screen.getByText("Ana Gomez")).toBeInTheDocument();
    expect(screen.queryByText("Carlos Mendez")).not.toBeInTheDocument();
  });

  it("toggles view mode between table and grid", async () => {
    mockApiFetch.mockResolvedValueOnce(MOCK_API_MEMBERS);

    render(<TeamPage />);

    await waitFor(() => {
      expect(screen.getByText("Carlos Mendez")).toBeInTheDocument();
    });

    // Switch to grid view
    const gridBtn = screen.getByLabelText("Vista cuadrícula");
    fireEvent.click(gridBtn);

    // Both table and grid render name, but table has "Correo Electrónico" header
    expect(screen.queryByText("Correo Electrónico")).not.toBeInTheDocument();

    // Switch back to table view
    const tableBtn = screen.getByLabelText("Vista tabla");
    fireEvent.click(tableBtn);
    expect(screen.getByText("Correo Electrónico")).toBeInTheDocument();
  });

  it("invites a new member via POST /api/team and shows toast feedback", async () => {
    mockApiFetch.mockResolvedValueOnce(MOCK_API_MEMBERS);
    const newMemberResponse = {
      id: "mem-new-1",
      name: "Martin Palermo",
      email: "martin@yieldstudio.io",
      role: "DevOps",
      status: "active",
      initials: "MP",
      joinedDate: "Justo ahora",
      lastActive: "Justo ahora",
    };
    mockApiFetch.mockResolvedValueOnce(newMemberResponse);

    render(<TeamPage />);

    await waitFor(() => {
      expect(screen.getByText("Carlos Mendez")).toBeInTheDocument();
    });

    // Open invite dialog
    const inviteBtn = screen.getByRole("button", { name: /Invitar Miembro/i });
    fireEvent.click(inviteBtn);

    expect(screen.getByText("Invitar Nuevo Miembro")).toBeInTheDocument();

    // Fill form
    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const nameInput = screen.getByLabelText(/Nombre Completo/i);
    const roleSelect = screen.getByLabelText(/Rol en el Equipo/i);

    fireEvent.change(emailInput, { target: { value: "martin@yieldstudio.io" } });
    fireEvent.change(nameInput, { target: { value: "Martin Palermo" } });
    fireEvent.change(roleSelect, { target: { value: "DevOps" } });

    // Submit form
    const submitBtn = screen.getByRole("button", { name: /Enviar Invitación/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockApiFetch).toHaveBeenCalledWith(
        "/api/team",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            name: "Martin Palermo",
            email: "martin@yieldstudio.io",
            role: "DevOps",
          }),
        }),
      );
    });

    // Verify member added and toast shown
    await waitFor(() => {
      expect(screen.getByText("Martin Palermo")).toBeInTheDocument();
      expect(screen.getByText(/invitación enviada/i)).toBeInTheDocument();
    });
  });

  it("updates member role via PATCH /api/team/:id and displays feedback toast", async () => {
    mockApiFetch.mockResolvedValueOnce(MOCK_API_MEMBERS);
    mockApiFetch.mockResolvedValueOnce({ success: true });

    render(<TeamPage />);

    await waitFor(() => {
      expect(screen.getByText("Carlos Mendez")).toBeInTheDocument();
    });

    // Change Carlos Mendez role to Admin
    const roleSelect = screen.getByLabelText("Cambiar rol de Carlos Mendez");
    fireEvent.change(roleSelect, { target: { value: "Admin" } });

    await waitFor(() => {
      expect(mockApiFetch).toHaveBeenCalledWith(
        "/api/team/mem-101",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ role: "Admin" }),
        }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/rol actualizado/i)).toBeInTheDocument();
    });
  });

  it("toggles member status via PATCH /api/team/:id and displays feedback toast", async () => {
    mockApiFetch.mockResolvedValueOnce(MOCK_API_MEMBERS);
    mockApiFetch.mockResolvedValueOnce({ success: true });

    render(<TeamPage />);

    await waitFor(() => {
      expect(screen.getByText("Carlos Mendez")).toBeInTheDocument();
    });

    // Toggle Carlos Mendez status (active -> offline)
    const statusBtn = screen.getByLabelText("Alternar estado de Carlos Mendez");
    fireEvent.click(statusBtn);

    await waitFor(() => {
      expect(mockApiFetch).toHaveBeenCalledWith(
        "/api/team/mem-101",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ status: "offline" }),
        }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/estado actualizado/i)).toBeInTheDocument();
    });
  });

  it("deletes a member via DELETE /api/team/:id from table view and displays toast", async () => {
    mockApiFetch.mockResolvedValueOnce(MOCK_API_MEMBERS);
    mockApiFetch.mockResolvedValueOnce({ success: true });

    render(<TeamPage />);

    await waitFor(() => {
      expect(screen.getByText("Carlos Mendez")).toBeInTheDocument();
    });

    // Delete Carlos Mendez
    const deleteBtn = screen.getByLabelText("Eliminar a Carlos Mendez");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockApiFetch).toHaveBeenCalledWith(
        "/api/team/mem-101",
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });

    // Carlos Mendez should be removed
    await waitFor(() => {
      expect(screen.queryByText("Carlos Mendez")).not.toBeInTheDocument();
      expect(screen.getByText(/eliminado/i)).toBeInTheDocument();
    });
  });

  it("deletes a member via DELETE /api/team/:id from grid view", async () => {
    mockApiFetch.mockResolvedValueOnce(MOCK_API_MEMBERS);
    mockApiFetch.mockResolvedValueOnce({ success: true });

    render(<TeamPage />);

    await waitFor(() => {
      expect(screen.getByText("Carlos Mendez")).toBeInTheDocument();
    });

    // Switch to grid view
    const gridBtn = screen.getByLabelText("Vista cuadrícula");
    fireEvent.click(gridBtn);

    // Delete Carlos Mendez in grid view
    const deleteBtn = screen.getByLabelText("Eliminar a Carlos Mendez");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockApiFetch).toHaveBeenCalledWith(
        "/api/team/mem-101",
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });

    await waitFor(() => {
      expect(screen.queryByText("Carlos Mendez")).not.toBeInTheDocument();
    });
  });
});
