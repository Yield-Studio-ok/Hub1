import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectsPage from "../app/projects/page";

describe("ProjectsPage", () => {
  beforeAll(() => {
    Object.defineProperty(window, "crypto", {
      value: {
        randomUUID: () => "mock-uuid",
      },
    });
  });
  it("should open the modal and allow setting repoUrl and deployUrl", () => {
    render(<ProjectsPage />);

    const createBtn = screen.getByText("Crear Proyecto");
    fireEvent.click(createBtn);

    expect(screen.getByText("Nuevo Proyecto")).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText("Mi proyecto...");
    fireEvent.change(nameInput, { target: { value: "Test Project" } });

    const repoInput = screen.getByPlaceholderText("https://github.com/...");
    fireEvent.change(repoInput, { target: { value: "https://github.com/yield/test" } });

    const deployInput = screen.getByPlaceholderText("https://test.vercel.app...");
    fireEvent.change(deployInput, { target: { value: "https://test.vercel.app" } });

    const submitBtn = screen.getByText("Crear");
    fireEvent.click(submitBtn);

    expect(screen.queryByText("Nuevo Proyecto")).not.toBeInTheDocument();
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });
});
