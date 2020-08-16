import amqp from 'amqplib/callback_api';
import { AMQP_CONNECTION_URL } from '../config/dotenv';

export default function (message = {}) {
  amqp.connect(AMQP_CONNECTION_URL, (err, connection) => {
    connection.createChannel((err, channel) => {
      const exchange = 'questions';

      channel.assertExchange(exchange, 'fanout', { durable: false });
      channel.publish(exchange, '', Buffer.from(JSON.stringify(message)));
    });

    setTimeout(() => connection.close(), 500);
  });
}
