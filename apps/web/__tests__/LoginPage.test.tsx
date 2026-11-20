import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../app/login/page";
import "@testing-library/jest-dom";

const mockLogin = jest.fn();
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("../lib/auth-context", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: mockLogin,
  }),
}));

describe("LoginPage Redesign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the redesigned login form with Yield Studio branding", () => {
    render(<LoginPage />);

    expect(screen.getByText("Bienvenido al Hub")).toBeInTheDocument();
    expect(screen.getByText("Yield Studio")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("nombre@ejemplo.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Iniciar sesión/i })).toBeInTheDocument();
  });

  it("autofills admin credentials when clicking the Admin quick-fill chip", () => {
    render(<LoginPage />);

    const adminChip = screen.getByRole("button", { name: /Admin/i });
    fireEvent.click(adminChip);

    const emailInput = screen.getByPlaceholderText("nombre@ejemplo.com") as HTMLInputElement;
    expect(emailInput.value).toBe("admin@admin.com");
  });

  it("autofills user credentials when clicking the Developer quick-fill chip", () => {
    render(<LoginPage />);

    const userChip = screen.getByRole("button", { name: /Developer/i });
    fireEvent.click(userChip);

    const emailInput = screen.getByPlaceholderText("nombre@ejemplo.com") as HTMLInputElement;
    expect(emailInput.value).toBe("user@user.com");
  });

  it("toggles password visibility", () => {
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText(/Contraseña/i) as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    const toggleBtn = screen.getByRole("button", { name: /toggle-password/i });
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe("text");

    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe("password");
  });

  it("handles form submission", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    render(<LoginPage />);

    const adminChip = screen.getByRole("button", { name: /Admin/i });
    fireEvent.click(adminChip);

    const submitBtn = screen.getByRole("button", { name: /Iniciar sesión/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("admin@admin.com", "admin123");
    });
  });
});
