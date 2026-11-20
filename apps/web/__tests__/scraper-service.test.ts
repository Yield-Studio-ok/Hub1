import { searchLeads, Lead } from "../lib/scraper";

// Mock global fetch
const originalFetch = global.fetch;

describe("searchLeads Service (TDD)", () => {
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("parses real results from Nominatim when available", async () => {
    const mockNominatimResponse = [
      {
        place_id: 123456,
        name: "Peluquería Don Juan",
        display_name: "Peluquería Don Juan, Calle Córdoba 1500, Rosario, Santa Fe, Argentina",
        lat: "-32.94682",
        lon: "-60.63932",
        extratags: {
          website: "https://peluqueriadonjuan.com",
          phone: "+54 341 4445555",
        },
      },
      {
        place_id: 789012,
        name: "Barbería Style",
        display_name: "Barbería Style, Bv. Oroño 400, Rosario, Santa Fe, Argentina",
        lat: "-32.93900",
        lon: "-60.65000",
        extratags: {},
      },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockNominatimResponse,
    } as Response);

    const results = await searchLeads({
      query: "peluqueria",
      location: "Rosario",
    });

    expect(results).toHaveLength(2);
    expect(results[0].name).toBe("Peluquería Don Juan");
    expect(results[0].website).toBe("https://peluqueriadonjuan.com");
    expect(results[0].isSolidLead).toBe(false);
    expect(results[0].mapsUrl).toContain("maps.google.com");

    expect(results[1].name).toBe("Barbería Style");
    expect(results[1].website).toBeNull();
    expect(results[1].isSolidLead).toBe(true);
  });

  it("filters out leads with websites when onlyWithoutWebsite is true", async () => {
    const mockNominatimResponse = [
      {
        place_id: 1,
        name: "Con Web",
        display_name: "Con Web, Calle 1, Rosario",
        lat: "-32.9",
        lon: "-60.6",
        extratags: { website: "https://conweb.com" },
      },
      {
        place_id: 2,
        name: "Sin Web",
        display_name: "Sin Web, Calle 2, Rosario",
        lat: "-32.9",
        lon: "-60.6",
        extratags: {},
      },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockNominatimResponse,
    } as Response);

    const results = await searchLeads({
      query: "peluqueria",
      location: "Rosario",
      onlyWithoutWebsite: true,
    });

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Sin Web");
    expect(results[0].website).toBeNull();
    expect(results[0].isSolidLead).toBe(true);
  });

  it("generates contextual fallback leads for the queried term and location when fetch fails or returns empty", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network Error / Rate limit"));

    const results = await searchLeads({
      query: "Peluquerías",
      location: "Rosario",
    });

    expect(results.length).toBeGreaterThan(0);
    // Must be tailored to Rosario and Peluquerías, NOT hardcoded CABA Pizzas!
    const namesAndAddresses = results.map((r) => `${r.name} ${r.address}`).join(" ");
    expect(namesAndAddresses.toLowerCase()).toContain("rosario");
    expect(namesAndAddresses.toLowerCase()).toMatch(/peluquer|barber|estilo|look/i);
    expect(namesAndAddresses).not.toContain("CABA");
  });
});
