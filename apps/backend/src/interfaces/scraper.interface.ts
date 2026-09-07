import { ScrapedJob } from "./scraper.validation"
export interface JobScraper {
  scrape(url: string): Promise<ScrapedJob>
}
