import express from 'express';
import bodyParser from 'body-parser';
import { MONGO, PORT } from './config/dotenv';
import { questions } from './config/routes';
import { URL_QUESTIONS } from './config/urls';
import connectToDB from './services/mongo';

const app = express();

connectToDB(MONGO);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(URL_QUESTIONS, questions);

app.get('/', (req, res) => {
  res.send('Hello World!🌎');
});

app.listen(PORT, () => console.log(`Your server is 🏃‍♂️💨 on http://0.0.0.0:${PORT}`));
