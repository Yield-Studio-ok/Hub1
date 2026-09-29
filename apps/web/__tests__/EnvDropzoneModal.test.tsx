import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { parseEnvFile } from "../lib/env-parser";
import { EnvDropzoneModal } from "../components/env-dropzone-modal";

jest.setTimeout(15000);

describe("env-parser: parseEnvFile", () => {
  it("parses standard KEY=value pairs", () => {
    const content = `
      PORT=3000
      HOST=localhost
    `;
    const result = parseEnvFile(content);
    expect(result).toEqual([
      { key: "PORT", value: "3000" },
      { key: "HOST", value: "localhost" },
    ]);
  });

  it("ignores blank lines and full-line comments", () => {
    const content = `
      # Database Configuration
      DATABASE_URL=postgres://user:pass@host:5432/db

      # Another comment
      # Empty line below

      API_KEY=xyz123
    `;
    const result = parseEnvFile(content);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      key: "DATABASE_URL",
      value: "postgres://user:pass@host:5432/db",
    });
    expect(result[1]).toEqual({ key: "API_KEY", value: "xyz123" });
  });

  it("handles double-quoted and single-quoted values, stripping wrapping quotes", () => {
    const content = `
      DOUBLE_QUOTED="hello world"
      SINGLE_QUOTED='single string'
      EMPTY_DOUBLE=""
      EMPTY_SINGLE=''
    `;
    const result = parseEnvFile(content);
    expect(result).toEqual([
      { key: "DOUBLE_QUOTED", value: "hello world" },
      { key: "SINGLE_QUOTED", value: "single string" },
      { key: "EMPTY_DOUBLE", value: "" },
      { key: "EMPTY_SINGLE", value: "" },
    ]);
  });

  it("supports values containing equal signs (=)", () => {
    const content = `
      CONNECTION_STRING=postgres://user:pass@localhost:5432/db?sslmode=require&pool=5
      BASE64_TOKEN=ZXhhbXBsZQ==
    `;
    const result = parseEnvFile(content);
    expect(result).toEqual([
      {
        key: "CONNECTION_STRING",
        value: "postgres://user:pass@localhost:5432/db?sslmode=require&pool=5",
      },
      { key: "BASE64_TOKEN", value: "ZXhhbXBsZQ==" },
    ]);
  });

  it("supports 'export' prefix and inline comments", () => {
    const content = `
      export API_SECRET=supersecret # pragma: allowlist secret
      DEBUG=true # enable debug mode
      QUOTED_WITH_HASH="hash # inside quotes" # comment after quote
    `;
    const result = parseEnvFile(content);
    expect(result).toEqual([
      { key: "API_SECRET", value: "supersecret" },
      { key: "DEBUG", value: "true" },
      { key: "QUOTED_WITH_HASH", value: "hash # inside quotes" },
    ]);
  });

  it("handles spaces around equal signs and keys properly", () => {
    const content = `
      SPACED_KEY = value_without_quotes
      ANOTHER   =   "spaced value"  
    `;
    const result = parseEnvFile(content);
    expect(result).toEqual([
      { key: "SPACED_KEY", value: "value_without_quotes" },
      { key: "ANOTHER", value: "spaced value" },
    ]);
  });
});

describe("EnvDropzoneModal Component", () => {
  const existingVars = [
    { key: "DATABASE_URL", value: "postgres://old_db", env: "Producción" },
    { key: "PORT", value: "3000", env: "Ambos" },
  ];

  const sampleEnvContent = `
    DATABASE_URL=postgres://new_db_url
    STRIPE_KEY=pk_test_12345
  `;

  it("renders when open is true with dropzone area", () => {
    render(
      <EnvDropzoneModal
        open={true}
        onOpenChange={jest.fn()}
        existingVars={existingVars}
        onApply={jest.fn()}
      />,
    );

    expect(screen.getByText(/Importar Variables de Entorno/i)).toBeInTheDocument();
    expect(screen.getByText(/Arrastra y suelta tu archivo \.env aquí/i)).toBeInTheDocument();
  });

  it("does not display modal content when open is false", () => {
    render(
      <EnvDropzoneModal
        open={false}
        onOpenChange={jest.fn()}
        existingVars={existingVars}
        onApply={jest.fn()}
      />,
    );

    expect(screen.queryByText(/Importar Variables de Entorno/i)).not.toBeInTheDocument();
  });

  it("parses file uploaded via input, previews variables and detects conflicts", async () => {
    render(
      <EnvDropzoneModal
        open={true}
        onOpenChange={jest.fn()}
        existingVars={existingVars}
        onApply={jest.fn()}
      />,
    );

    const file = new File([sampleEnvContent], ".env.production", {
      type: "text/plain",
    });

    const fileInput = screen.getByTestId("env-file-input");
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("DATABASE_URL")).toBeInTheDocument();
      expect(screen.getByText("STRIPE_KEY")).toBeInTheDocument();
    });

    // Conflict detection for DATABASE_URL
    expect(screen.getAllByText(/Conflicto/i).length).toBeGreaterThan(0);
  });

  it("applies variables in Merge mode by default", async () => {
    const handleApply = jest.fn();
    const handleOpenChange = jest.fn();

    render(
      <EnvDropzoneModal
        open={true}
        onOpenChange={handleOpenChange}
        existingVars={existingVars}
        onApply={handleApply}
      />,
    );

    const file = new File([sampleEnvContent], ".env", { type: "text/plain" });
    const fileInput = screen.getByTestId("env-file-input");
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("STRIPE_KEY")).toBeInTheDocument();
    });

    const applyButton = screen.getByRole("button", { name: /Aplicar Variables/i });
    expect(applyButton).not.toBeDisabled();
    fireEvent.click(applyButton);

    expect(handleApply).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: "DATABASE_URL", value: "postgres://new_db_url" }),
        expect.objectContaining({ key: "STRIPE_KEY", value: "pk_test_12345" }),
      ]),
      "merge",
    );
  });

  it("allows selecting Overwrite mode and applies variables with 'overwrite'", async () => {
    const handleApply = jest.fn();

    render(
      <EnvDropzoneModal
        open={true}
        onOpenChange={jest.fn()}
        existingVars={existingVars}
        onApply={handleApply}
      />,
    );

    const file = new File([sampleEnvContent], ".env", { type: "text/plain" });
    fireEvent.change(screen.getByTestId("env-file-input"), {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByText("STRIPE_KEY")).toBeInTheDocument();
    });

    // Select Overwrite mode
    const overwriteOption = screen.getByRole("button", { name: /Reemplazar|Overwrite/i });
    fireEvent.click(overwriteOption);

    const applyButton = screen.getByRole("button", { name: /Aplicar Variables/i });
    fireEvent.click(applyButton);

    expect(handleApply).toHaveBeenCalledWith(expect.any(Array), "overwrite");
  });

  it("handles drag and drop file upload", async () => {
    render(
      <EnvDropzoneModal
        open={true}
        onOpenChange={jest.fn()}
        existingVars={existingVars}
        onApply={jest.fn()}
      />,
    );

    const dropzone = screen.getByTestId("env-dropzone");
    const file = new File(["FOO=BAR"], ".env", { type: "text/plain" });

    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByText("FOO")).toBeInTheDocument();
    });
  });

  it("closes modal when Cancel button is clicked", () => {
    const handleOpenChange = jest.fn();

    render(
      <EnvDropzoneModal
        open={true}
        onOpenChange={handleOpenChange}
        existingVars={existingVars}
        onApply={jest.fn()}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelButton);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("ProjectDetailsPage Env Integration", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cpu: 10, memory: 20 }),
      }),
    );
  });

  it("navigates to Variables de Entorno, displays 'Importar .env' button and opens modal", async () => {
    const ProjectDetailsPage = require("../app/projects/[id]/page").default;
    render(<ProjectDetailsPage params={{ id: "3" }} />);

    // Switch to infrastructure tab
    const infraTab = screen.getByRole("tab", { name: /Infraestructura/i });
    fireEvent.click(infraTab);

    // Switch to Variables de Entorno section
    const envSubNavBtn = screen.getByRole("button", { name: /Variables de Entorno/i });
    fireEvent.click(envSubNavBtn);

    // Check Importar .env button
    const importBtn = screen.getByRole("button", { name: /Importar \.env/i });
    expect(importBtn).toBeInTheDocument();

    // Open modal
    fireEvent.click(importBtn);
    expect(screen.getByText(/Importar Variables de Entorno/i)).toBeInTheDocument();

    // Import a new variable
    const file = new File(["CUSTOM_FEATURE_FLAG=enabled"], ".env", { type: "text/plain" });
    const fileInput = screen.getByTestId("env-file-input");
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("CUSTOM_FEATURE_FLAG")).toBeInTheDocument();
    });

    const applyButton = screen.getByRole("button", { name: /Aplicar Variables/i });
    fireEvent.click(applyButton);

    // Ensure the new variable is now rendered in the project's env list
    await waitFor(() => {
      expect(screen.getByText("CUSTOM_FEATURE_FLAG")).toBeInTheDocument();
    });
  });
});
