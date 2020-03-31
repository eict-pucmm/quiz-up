import amqp from 'amqplib';
import { AMQP_CONNECTION_URL } from '../config/dotenv';

export default async function(flag = false) {
  try {
    const exchange = 'answers';
    const connection = await amqp.connect(AMQP_CONNECTION_URL);
    if (flag) {
      await connection.close();
    } else {
      const channel = await connection.createChannel();
      await channel.assertExchange(exchange, 'fanout', { durable: false });
      const queue = await channel.assertQueue('', { exclusive: true });
      await channel.bindQueue(queue.queue, exchange, '');
      try {
        channel.consume(
          queue.queue,
          message => {
            console.log(' [x] %s %s', message.content.toString(), new Date());
          },
          { noAck: true },
        );
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    process.exit(1);
  }
}
