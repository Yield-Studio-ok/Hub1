import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ScraperQuickGuide } from "../components/scraper-quick-guide";

describe("ScraperQuickGuide Component (Ticket 11.1)", () => {
  it("renders the trigger button with 'Guía Rápida' text and icon", () => {
    render(<ScraperQuickGuide />);

    const triggerButton = screen.getByRole("button", { name: /guía rápida/i });
    expect(triggerButton).toBeInTheDocument();
  });

  it("does not render modal dialog content when closed by default", () => {
    render(<ScraperQuickGuide />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText(/Guía Rápida del Scraper/i)).not.toBeInTheDocument();
  });

  it("opens modal dialog when trigger button is clicked", async () => {
    render(<ScraperQuickGuide />);

    const triggerButton = screen.getByRole("button", { name: /guía rápida/i });
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText(/Guía Rápida del Scraper/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Búsqueda por rubro y localidad/i)).toBeInTheDocument();
    expect(screen.getByText(/Doble Validación de Leads/i)).toBeInTheDocument();
    expect(screen.getByText(/Acción comercial/i)).toBeInTheDocument();
    expect(screen.getByText(/Consejos y mejores prácticas/i)).toBeInTheDocument();
  });

  it("renders with controlled open prop", () => {
    render(<ScraperQuickGuide open={true} onOpenChange={jest.fn()} />);

    expect(screen.getByText(/Guía Rápida del Scraper/i)).toBeInTheDocument();
    expect(screen.getByText(/Búsqueda por rubro y localidad/i)).toBeInTheDocument();
  });

  it("displays step details and allows toggling accordion items", async () => {
    render(<ScraperQuickGuide defaultOpen={true} />);

    // Step 1 is expanded by default or can be clicked to view content
    expect(screen.getByText(/Búsqueda por rubro y localidad/i)).toBeInTheDocument();
    expect(screen.getAllByText(/radio de búsqueda/i).length).toBeGreaterThan(0);

    // Click on Step 2 (Doble Validación)
    const step2Header = screen.getByRole("button", { name: /Doble Validación de Leads/i });
    fireEvent.click(step2Header);

    await waitFor(() => {
      expect(screen.getAllByText(/Solo Leads Sólidos/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/sin sitio web/i).length).toBeGreaterThan(0);
    });

    // Click on Step 3 (Acción comercial)
    const step3Header = screen.getByRole("button", { name: /Acción comercial/i });
    fireEvent.click(step3Header);

    await waitFor(() => {
      expect(screen.getAllByText(/Google Maps/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/prospectar/i).length).toBeGreaterThan(0);
    });

    // Click on Step 4 (Consejos y mejores prácticas)
    const step4Header = screen.getByRole("button", { name: /Consejos y mejores prácticas/i });
    fireEvent.click(step4Header);

    await waitFor(() => {
      expect(screen.getAllByText(/mejores prácticas/i).length).toBeGreaterThan(0);
    });
  });

  it("closes the modal when 'Entendido' action button is clicked", async () => {
    const handleOpenChange = jest.fn();
    render(<ScraperQuickGuide defaultOpen={true} onOpenChange={handleOpenChange} />);

    const entendidoBtn = screen.getByRole("button", { name: /entendido/i });
    fireEvent.click(entendidoBtn);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("closes the modal when the close icon button is clicked", async () => {
    const handleOpenChange = jest.fn();
    render(<ScraperQuickGuide defaultOpen={true} onOpenChange={handleOpenChange} />);

    const closeBtn = screen.getByRole("button", { name: /cerrar/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });
});

describe("ScraperPage Header Integration (Ticket 11.1)", () => {
  it("renders 'Guía Rápida' button in the page header and opens the quick guide modal", async () => {
    // Dynamic import to avoid SSR issues if any
    const { default: ScraperPage } = await import("../app/scraper/page");
    render(<ScraperPage />);

    const guideBtn = screen.getByRole("button", { name: /guía rápida/i });
    expect(guideBtn).toBeInTheDocument();

    fireEvent.click(guideBtn);

    await waitFor(() => {
      expect(screen.getByText(/Guía Rápida del Scraper/i)).toBeInTheDocument();
      expect(screen.getByText(/Búsqueda por rubro y localidad/i)).toBeInTheDocument();
    });
  });
});
