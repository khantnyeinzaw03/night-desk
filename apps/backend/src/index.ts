import dotenv from 'dotenv';
import express from 'express';
import { FirecrawlService } from './services/firecrawl.service';
import { Request, Response } from 'express';
import { Firecrawl } from 'firecrawl';
import connectDB from './db/pool';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

connectDB();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/scrape', async (req: Request, res: Response) => {
  const scraper = new FirecrawlService(new Firecrawl({
    apiKey: process.env.FIRECRAWL_API_KEY
  }));
  const result = await scraper.scrape(req.body.url);
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
