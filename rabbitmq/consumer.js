import amqp from "amqplib";

const consumer = async (msg) => {
  try {
    const url = process.env.URL;
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    const exchange = "cold_mail";
    const queue = "mail";
    const routing_key = "route-1";

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(queue, { durable: false });
    await channel.bindQueue(queue, exchange, routing_key);

    console.log("Waiting for messages...");

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());
        console.log("Received message:", messageContent);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error consuming RabbitMQ message:", error);
  }
};

export default consumer;
