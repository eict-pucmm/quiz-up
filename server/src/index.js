import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { MONGO, PORT } from './config/dotenv';
import { questions, categories, competitors } from './config/routes';
import { URL_QUESTIONS, URL_CATEGORIES, URL_COMPETITORS } from './config/urls';
import connectToDB from './services/mongo';
import joiValidation from './services/joiValidation';

connectToDB(MONGO);
joiValidation();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(URL_QUESTIONS, questions);
app.use(URL_CATEGORIES, categories);
app.use(URL_COMPETITORS, competitors);

app.get('/', (req, res) => res.send('Hello World!🌎'));

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'app/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../app/build', 'index.html'));
  });
}

app.listen(PORT, () =>
  console.log(`Your server is 🏃‍♂️💨 on http://0.0.0.0:${PORT}`),
);
