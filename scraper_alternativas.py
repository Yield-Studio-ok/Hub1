import json
from scrapling.fetchers import StealthyFetcher

repos = [
    "https://github.com/nexu-io/open-design",
    "https://github.com/e2b-dev/fragments",
    "https://github.com/open-webui/open-webui"
]

def scrape_github_repo(url):
    print(f"\nScrapeando {url}...")
    
    # StealthyFetcher maneja anti-bots automticamente.
    # Inicializamos y pedimos la pagina
    page = StealthyFetcher.fetch(url, headless=True)
    
    # Scrapling usa una API muy parecida a css selectors estandar
    title_elems = page.css('strong[itemprop="name"] a')
    title = title_elems[0].text if title_elems else url.split('/')[-1]
    
    desc_elems = page.css('p.f4')
    description = desc_elems[0].text.strip() if desc_elems else "Sin descripción"
    
    stars_elems = page.css('#repo-stars-counter-star')
    stars = stars_elems[0].attrib.get('title', '0') if stars_elems else "0"
    
    # github updates, e.g. <relative-time> elements
    time_elems = page.css('relative-time')
    last_updated = time_elems[0].attrib.get('datetime', 'Desconocido') if time_elems else "Desconocido"

    return {
        "url": url,
        "name": title,
        "description": description,
        "stars": stars,
        "last_updated": last_updated
    }

def main():
    results = []
    for repo in repos:
        try:
            data = scrape_github_repo(repo)
            results.append(data)
            print(f"Éxito: {data['name']} - {data['stars']} estrellas - Act: {data['last_updated']}")
        except Exception as e:
            print(f"Error scrapeando {repo}: {e}")
            
    with open("resultados_alternativas.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4, ensure_ascii=False)
    
    print("\nResultados guardados en resultados_alternativas.json")

if __name__ == "__main__":
    main()
