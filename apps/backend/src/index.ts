import dotenv from "dotenv"
import express from "express"
import { FirecrawlService } from "./services/firecrawl.service"
import { Request, Response } from "express"
import { Firecrawl } from "firecrawl"
import connectDB from "./db/pool"
import Job from "./db/schema/job.schema"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

connectDB()

app.get("/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.post("/scrape", async (req: Request, res: Response) => {
  const { url } = req.body
  const scraper = new FirecrawlService(
    new Firecrawl({
      apiKey: process.env.FIRECRAWL_API_KEY
    })
  )
  try {
    const result = await scraper.scrape(url)
    const job = new Job({ ...result, url })
    await job.save()
    res.json({ message: "Job scraped and saved successfully", job })
  } catch (error) {
    res.status(500).json({ message: "Error scraping and saving job", error })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
