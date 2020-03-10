import amqp from 'amqplib/callback_api';
import { AMQP_CONNECTION_URL } from '../config/dotenv';

export default function() {
  amqp.connect(AMQP_CONNECTION_URL, (err, connection) => {
    connection.createChannel((error, channel) => {
      const exchange = 'answers';

      channel.assertExchange(exchange, 'fanout', { durable: false });

      channel.assertQueue('', { exclusive: true }, (err, queue) => {
        channel.bindQueue(queue.queue, exchange, '');

        channel.consume(
          queue.queue,
          message => {
            console.log(' [x] %s %s', message.content.toString(), new Date());
          },
          { noAck: true },
        );
      });
    });
  });
}
