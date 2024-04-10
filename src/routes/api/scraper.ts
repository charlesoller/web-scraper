import { Router } from 'express';
import { Request, Response } from 'express';

export const scraper = Router();
import { tenTreeScrape } from '../../util/scrape';

scraper.post('/', async (req: Request, res: Response) => {
    // console.log("REQUEST: ", req.body)
    const { url } = req.body
    const data = await tenTreeScrape(url)
    console.log("DATA: ", data)
    res.json(data);
});
