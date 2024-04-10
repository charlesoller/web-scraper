import { Router } from 'express';
import { scraper } from './scraper';

export const api = Router();
api.use('/scraper', scraper)
