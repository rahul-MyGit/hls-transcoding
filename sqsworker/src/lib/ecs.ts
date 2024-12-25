import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_ACCESS_KEY } from "../config";

const client = new ECSClient({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
})

export const runTask = async ( runTaskParams : any) => {
    const command = new RunTaskCommand(runTaskParams);
    try {
        const data = await client.send(command);
        return data;
    } catch (error) {
        console.log('Error running task', error);
        return null;
    }
}