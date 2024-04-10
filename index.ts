import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import { router } from './src/routes';
import bodyParser from 'body-parser';

//For env File
dotenv.config();

const app: Application = express();
// app.use(bodyParse)
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use('/', router)

const port = process.env.PORT || 8000;

// app.get('/', (req: Request, res: Response) => {
//   res.send('Base Test Route');
// });

app.listen(port, () => {
  console.log(`Server is live at http://localhost:${port}`);
});
