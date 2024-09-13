import amqp from "amqplib";

const producer = async (msg) => {
  const url = process.env.URL;
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();

  try {
    const exchange = "cold_mail";
    const queue = "mail-from-node";
    const routing_key = "route-1";

    await channel.assertExchange(exchange, "direct", {
      durable: true,
    });
    await channel.assertQueue(queue, {
      durable: false,
    });
    await channel.bindQueue(queue, exchange, routing_key);

    const messageBuffer = Buffer.from(JSON.stringify(msg));
    await channel.publish(exchange, routing_key, messageBuffer);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.log(error);
  }
};

export default producer;
