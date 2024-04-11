import { Router } from 'express';
import { Request, Response } from 'express';

export const scraper = Router();
import { tenTreeScrape, generalScraper,smartScrape } from '../../util/scrape';

scraper.post('/', async (req: Request, res: Response) => {
    // console.log("REQUEST: ", req.body)
    const { url } = req.body
    try {
        // const data = await tenTreeScrape(url)
        const data = await generalScraper(url)

        // https://hiutdenim.co.uk/collections/made-to-order-mens/products/the-slimr-japanese-selvedge
        // const data = await smartScrape(url)
        res.json(data)
    } catch (e:any) {
        res.status(501).json({ "error": e.message })
    }
});
