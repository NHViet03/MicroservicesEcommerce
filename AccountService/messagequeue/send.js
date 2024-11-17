import "dotenv/config";
import { ServiceBusClient } from "@azure/service-bus";

const connectionString = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING;

const queueName = process.env.AZURE_SERVICE_BUS_QUEUE_NAME;


const publishMessage = async (message) => {
  const sbClient = new ServiceBusClient(connectionString);
  const sender = sbClient.createSender(queueName);

  try {
    let batch = await sender.createMessageBatch();

    if (!batch.tryAddMessage(message)) {
      throw new Error("Message too big to fit in a batch");
    }

    await sender.sendMessages(batch);

    console.log(`Sent a batch of messages to the queue: ${queueName}`);

    await sender.close();
  } catch (err) {
    console.log("Error occurred: ", err);
  } finally {
    await sbClient.close();
  }
}

export default publishMessage;

