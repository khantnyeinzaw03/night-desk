import { Firecrawl } from "firecrawl"
import { JobScraper } from "../interfaces/scraper.interface"

export class FirecrawlService implements JobScraper {
  constructor(private readonly firecrawl: Firecrawl) {}
  async scrape(url: string) {
    const result = await this.firecrawl.scrape(url, {
      formats: [
        {
          type: "json",
          schema: {
            type: "object",
            properties: {
              title: {
                type: ["string", "null"],
                description: "Page title. Return null if not found."
              },
              company: {
                type: ["string", "null"],
                description: "Company name. Return null if not found."
              },
              location: {
                type: ["string", "null"],
                description: "Location. Return null if not found."
              },
              skills: {
                type: ["string", "null"],
                description: "Skills. Return null if not found."
              },
              salary: {
                type: ["string", "null"],
                description: "Salary. Return null if not found."
              }
            }
          }
        }
      ]
    })
    return result.json
  }
}
