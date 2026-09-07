export interface JobScraper {
  scrape(url: string): Promise<unknown>
}

export interface Normalizer {
  normalize(job: unknown): NormalizedJob
}

export interface NormalizedJob {
  title: string
  company: string
  location: string | null
  workType: "remote" | "onsite" | "hybrid"
  salaryMin: number | null
  salaryMax: number | null
  currency: string | null
  skills: string[]
  description: string
}
