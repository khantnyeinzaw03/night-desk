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

    // v2 JSON format is an object; string "json" is rejected by the SDK.
    // Sources:
    // https://docs.firecrawl.dev/features/llm-extract
    // https://docs.firecrawl.dev/agent-source-of-truth/node
    const result = await firecrawl.scrape(url, {
      formats: [
        {
          type: "json",
          prompt:
            "Extract the page title, a short summary, and the main visible content.",
          schema: {
            type: "object",
            properties: {
              title: {
                type: ["string", "null"],
                description: "Page title. Return null if not found.",
              },
              summary: {
                type: ["string", "null"],
                description: "Short summary of the page. Return null if not found.",
              },
              content: {
                type: ["string", "null"],
                description: "Main visible content. Return null if not found.",
              },
            },
          },
          checkPromptInjection: true,
        },
      ],
    })
    res.json(result.json)
  } catch (error) {
    res.status(500).json({ error: String(error) })
    return
  }
}
