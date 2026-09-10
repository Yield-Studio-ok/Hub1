import { Injectable, Logger } from "@nestjs/common";
import puppeteer from "puppeteer";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return "Scraper service is running!";
  }

  async scrape(url: string): Promise<{ title: string; url: string }> {
    this.logger.log(`Starting scrape for URL: ${url}`);

    // Launch headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      // Navigate to URL
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // Extract title
      const title = await page.title();

      this.logger.log(`Scraped title: ${title}`);

      return { title, url };
    } catch (error: any) {
      this.logger.error(`Error scraping ${url}:`, error.message);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async getMetadata(url: string) {
    this.logger.log(`Starting metadata extraction for URL: ${url}`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      // Navigate to URL with a timeout to avoid hanging
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

      const metadata = await page.evaluate(() => {
        // oxlint-disable-next-line
        const getMetaContent = (selector: string): string | null => {
          const element = document.querySelector(selector);
          return element ? element.getAttribute("content") : null;
        };

        const ogTitle =
          getMetaContent('meta[property="og:title"]') || getMetaContent('meta[name="og:title"]');
        const ogDescription =
          getMetaContent('meta[property="og:description"]') ||
          getMetaContent('meta[name="og:description"]');
        const ogImage =
          getMetaContent('meta[property="og:image"]') || getMetaContent('meta[name="og:image"]');

        const title = ogTitle || document.title || null;
        const description = ogDescription || getMetaContent('meta[name="description"]') || null;
        const image = ogImage || null;

        return { title, description, image };
      });

      this.logger.log(`Extracted metadata for ${url}`);

      return {
        ...metadata,
        url,
      };
    } catch (error: any) {
      this.logger.warn(
        `Scraping blocked or failed for ${url}: ${error.message}. Returning graceful degradation response.`,
      );
      return {
        title: null,
        description: null,
        image: null,
        url,
        error: error.message || "Unknown error occurred during scraping",
      };
    } finally {
      await browser.close();
    }
  }
}
