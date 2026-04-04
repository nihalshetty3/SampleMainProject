const amqp = require("amqplib");   
let channel;


async function connectQueue() {
    const connection = await amqp.connect("amqp://localhost"); 
    channel = await connection.createChannel();

    await channel.assertQueue("event_queue", {
        durable: true
    });

    console.log("RabbitMQ connected");
}


async function pushToQueue(data) {
    if (!channel) {
        throw new Error("Queue not connected");  
    }

    channel.sendToQueue(
        "event_queue",
        Buffer.from(JSON.stringify(data)),
        { persistent: true }
    );
}

module.exports = {
    connectQueue,
    pushToQueue
};