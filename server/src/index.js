import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
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

app.use(cors());
app.use(helmet());
if (NODE_ENV !== 'production') app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!🌎'));
//setting up all other API routes
setRoutes(app);

const socketio = io.init(server);
socketMagic(socketio);

server.listen(PORT, () =>
    console.log(`URI: ${MONGO}\nYour server is 🏃‍♂️💨 on http://0.0.0.0:${PORT}`)
);