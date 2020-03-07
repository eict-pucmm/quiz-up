import express from 'express';
import bodyParser from 'body-parser';
import { MONGO, PORT } from './config/dotenv';
import { questions, categories } from './config/routes';
import { URL_QUESTIONS, URL_CATEGORIES } from './config/urls';
import connectToDB from './services/mongo';
import joiValidation from './services/joiValidation';

connectToDB(MONGO);
joiValidation();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(URL_QUESTIONS, questions);
app.use(URL_CATEGORIES, categories);

app.get('/', (req, res) => {
  res.send('Hello World!🌎');
});

app.listen(PORT, () => console.log(`Your server is 🏃‍♂️💨 on http://0.0.0.0:${PORT}`));
