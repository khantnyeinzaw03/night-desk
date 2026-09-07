import { Firecrawl } from "firecrawl"
import { JobScraper } from "../interfaces/scraper.interface"
import { jobSchema, ScrapedJob } from "../interfaces/scraper.validation"

export class FirecrawlService implements JobScraper {
  constructor(private readonly firecrawl: Firecrawl) {}
  async scrape(url: string): Promise<ScrapedJob> {
    try {
      const result = await this.firecrawl.scrape(url, {
        formats: [
          {
            type: "json",
            schema: jobSchema.toJSONSchema()
          }
        ]
      })
      const parsedResult = jobSchema.parse(result.json)
      return parsedResult
    } catch (error) {
      throw error
    }
  }
}
