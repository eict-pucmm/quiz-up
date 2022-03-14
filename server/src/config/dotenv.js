import dotenv from 'dotenv';

dotenv.config();

const AMQP_CONNECTION_URL = process.env.AMQP_CONNECTION_URL;
const MONGO = process.env.MONGO_URI || process.env.MONGO_DOCKER_URI;
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

export { AMQP_CONNECTION_URL, MONGO, PORT, NODE_ENV };
