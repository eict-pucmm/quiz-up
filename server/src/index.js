import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import path from 'path';
import { MONGO, PORT, NODE_ENV } from './config/dotenv';

import connectToDB from './services/mongo';
import joiValidation from './services/joiValidation';
import io from './services/socket';
import setRoutes from './config/routes';
import { socketMagic } from './services/socketMagic';

connectToDB(MONGO);
joiValidation();

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//using all API routes
setRoutes(app);

app.get('/', (req, res) => res.send('Hello World!🌎'));

if (NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'app/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../app/build', 'index.html'));
  });
}

const socketio = io.init(server);
socketMagic(socketio);

server.listen(PORT, () =>
  console.log(`Your server is 🏃‍♂️💨 on http://0.0.0.0:${PORT}`)
);
