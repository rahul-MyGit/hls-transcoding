import { INPUT_FILE_PATH, OUTPUT_BUCKET, OUTPUT_FILE_PATH, RESOLUTION, VIDEO_BUCKET, VIDEO_KEY } from "./config";


const transcode = async () => {
    try {
        await downloadFromS3(VIDEO_BUCKET, VIDEO_KEY, INPUT_FILE_PATH);

        await transcodeVideo(VIDEO_KEY, INPUT_FILE_PATH, OUTPUT_FILE_PATH, OUTPUT_BUCKET, RESOLUTION);

        await markAsProcessing(`videos:${VIDEO_KEY}:status`, "uploaded");
    } catch (error) {
        console.log(error);

        await markAsProcessing(`video:${VIDEO_KEY}:status`, "failed");
    }
}

transcode();