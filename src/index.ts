import express, { json } from 'express';
import { api } from './routes/api';

const app = express();

app.use(json());
app.use('/', express.static(`${__dirname}docs/.vuepress/dist`.replace(/(lib|src)/, '')));

app.use('/api', api);

app.get('/', (req: express.Request, res: express.Response): void => {
  res.sendFile(`${__dirname}docs/.vuepress/dist/index.html`.replace(/(lib|src)/, ''));
});

app.listen(8080);
