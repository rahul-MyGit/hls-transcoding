import { runTask } from "../ecs";
import { markAsProcessing } from "../redis";


export const processMessage = async (mesage: any) => {
    try {
        const videoDetails = JSON.parse(mesage.Body);
        console.log('Processing message', videoDetails);
        const bucket = videoDetails.Record[0].s3.bucket.name;
        const key = videoDetails.Record[0].s3.object.key;

        console.log("asdasda", key);

        await markAsProcessing(`videos:${key}:status`, "processing");

        const runTaskParams = {
            //Some Shit
        }

        const response = await runTask(runTaskParams);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}