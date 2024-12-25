import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_ACCESS_KEY } from "../config";
import { transcode } from "buffer";


export const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});
//TODO: Make types in seperate folder


export const downloadFromS3 = async (bucketName : string, videoKey: string, filePath: string) => {
    // Download video from S3

}

export const uploadFromS3 = async (bucketName : string, videoKey: string, filePath: string) => {
    //upload video to prod wala S3
}

export const transcodeVideo = async (videoKey: string, inputFile: string, outputDir: string, bucketName: string, resolutions: string[]) => {
    //transcode video
}