import { Firecrawl } from "firecrawl"
import dotenv from "dotenv"
import { Request, Response } from "express"

dotenv.config()

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY
})

export default async function webScrape(req: Request, res: Response) {
  try {
    const url = req.body?.url as string
    if (!url) {
      res.status(400).json({ error: "Missing url parameter in request body" })
      return
    }

    const result = await firecrawl.scrape(url, {
      formats: ["json"]
    })
    res.json(result.json)
  } catch (error) {
    res.status(500).json({ error: String(error) })
    return
  }
}
