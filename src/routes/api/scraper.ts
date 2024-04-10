import { Router } from 'express';
import { Request, Response } from 'express';

export const scraper = Router();
import { testScrape } from '../../util/scrape';

scraper.post('/', async (req: Request, res: Response) => {
    console.log("REQUEST: ", req.body)
    const { url } = req.body
    await testScrape(url)
    res.json({ request: url});
});
