import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ScraperPage from "../app/scraper/page";
import * as scraperModule from "../lib/scraper";

jest.mock("../lib/scraper", () => ({
  __esModule: true,
  searchLeads: jest.fn(),
}));

const mockSearchLeads = scraperModule.searchLeads as jest.MockedFunction<
  typeof scraperModule.searchLeads
>;

describe("ScraperPage Component (Radar HUD & Leads Search)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the search inputs, map modal trigger, and initial UI", () => {
    render(<ScraperPage />);

    expect(screen.getByPlaceholderText(/Pizzerías, Inmobiliarias, Gimnasios/i)).toBeInTheDocument();
    expect(screen.getByText(/Seleccionar en el mapa/i)).toBeInTheDocument();
    expect(screen.getByText(/Solo negocios sin página web/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Iniciar Búsqueda/i })).toBeInTheDocument();
  });

  it("opens the map dialog and displays the Neon Radar HUD with distance badge", async () => {
    render(<ScraperPage />);

    const mapTrigger = screen.getByText(/Seleccionar en el mapa/i);
    fireEvent.click(mapTrigger);

    await waitFor(() => {
      expect(screen.getByText(/Seleccionar Zona en Google Maps/i)).toBeInTheDocument();
    });

    // Check for Radar HUD elements
    const radarContainer = screen.getByTestId("radar-hud");
    expect(radarContainer).toBeInTheDocument();

    // Verify distance badge inside radar shows the default 5 km
    expect(screen.getAllByText(/5 km/i).length).toBeGreaterThan(0);

    // Test slider update
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "15" } });

    expect(screen.getAllByText(/15 km/i).length).toBeGreaterThan(0);
  });

  it("searches and renders leads with website and without website", async () => {
    mockSearchLeads.mockResolvedValueOnce([
      {
        id: "lead-1",
        name: "Peluquería Don Juan",
        address: "Calle Córdoba 1500, Rosario",
        website: "https://donjuan.com",
        mapsUrl: "https://maps.google.com/?q=Don+Juan",
        rating: 4.8,
        isSolidLead: false,
      },
      {
        id: "lead-2",
        name: "Barbería Style Rosario",
        address: "Bv. Oroño 400, Rosario",
        website: null,
        mapsUrl: "https://maps.google.com/?q=Barberia+Style",
        rating: 4.5,
        isSolidLead: true,
      },
    ]);

    render(<ScraperPage />);

    const queryInput = screen.getByPlaceholderText(/Pizzerías, Inmobiliarias, Gimnasios/i);
    fireEvent.change(queryInput, { target: { value: "Peluquería" } });

    // Open map and set location
    const mapTrigger = screen.getByText(/Seleccionar en el mapa/i);
    fireEvent.click(mapTrigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Buscar ciudad o barrio/i)).toBeInTheDocument();
    });

    const locationInput = screen.getByPlaceholderText(/Buscar ciudad o barrio/i);
    fireEvent.change(locationInput, { target: { value: "Rosario" } });

    const confirmBtn = screen.getByRole("button", { name: /Confirmar Zona/i });
    fireEvent.click(confirmBtn);

    // Submit search
    const submitBtn = screen.getByRole("button", { name: /Iniciar Búsqueda/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Peluquería Don Juan/i)).toBeInTheDocument();
      expect(screen.getByText(/Barbería Style Rosario/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Calle Córdoba 1500, Rosario/i)).toBeInTheDocument();
    expect(screen.getByText(/Sin sitio web/i)).toBeInTheDocument();
    expect(screen.getByText(/https:\/\/donjuan.com/i)).toBeInTheDocument();
  });

  it("respects 'Solo negocios sin página web' filter", async () => {
    mockSearchLeads.mockResolvedValueOnce([
      {
        id: "lead-1",
        name: "Peluquería Don Juan",
        address: "Calle Córdoba 1500, Rosario",
        website: "https://donjuan.com",
        mapsUrl: "https://maps.google.com/?q=Don+Juan",
        rating: 4.8,
        isSolidLead: false,
      },
      {
        id: "lead-2",
        name: "Barbería Style Rosario",
        address: "Bv. Oroño 400, Rosario",
        website: null,
        mapsUrl: "https://maps.google.com/?q=Barberia+Style",
        rating: 4.5,
        isSolidLead: true,
      },
    ]);

    render(<ScraperPage />);

    const queryInput = screen.getByPlaceholderText(/Pizzerías, Inmobiliarias, Gimnasios/i);
    fireEvent.change(queryInput, { target: { value: "Peluquería" } });

    // Open map and set location
    const mapTrigger = screen.getByText(/Seleccionar en el mapa/i);
    fireEvent.click(mapTrigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Buscar ciudad o barrio/i)).toBeInTheDocument();
    });

    const locationInput = screen.getByPlaceholderText(/Buscar ciudad o barrio/i);
    fireEvent.change(locationInput, { target: { value: "Rosario" } });

    const confirmBtn = screen.getByRole("button", { name: /Confirmar Zona/i });
    fireEvent.click(confirmBtn);

    // Check "Solo negocios sin página web"
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    // Submit search
    const submitBtn = screen.getByRole("button", { name: /Iniciar Búsqueda/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Barbería Style Rosario/i)).toBeInTheDocument();
    });

    // Don Juan has a website so it should be filtered out
    expect(screen.queryByText(/Peluquería Don Juan/i)).not.toBeInTheDocument();
  });
});
