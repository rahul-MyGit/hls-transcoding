import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_ACCESS_KEY, AWS_SQS_QUEUE_URL } from "../config";

const sqsClient = new SQSClient({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});

export const receiveMessage = async () => {
    const command = new ReceiveMessageCommand({
        QueueUrl: AWS_SQS_QUEUE_URL,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 3
    });
    try {
        const data = await sqsClient.send(command);
        return data;
    } catch (error) {
        console.log('Error receiving message', error);
        return null;
    }
}

export const deleteMessage = async (receiptHandle: string) => {
    const command = new DeleteMessageCommand({
        QueueUrl: AWS_SQS_QUEUE_URL,
        ReceiptHandle: receiptHandle
    });
    try {
        const data = await sqsClient.send(command);
        return data;
    } catch (error) {
        console.log('Error deleting message', error);
        return null;
    }
}
