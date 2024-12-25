import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_ACCESS_KEY } from "../config";
import { createWriteStream, readFileSync } from "fs";
import { Readable } from 'stream';

export const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});

export const downloadFromS3 = async (bucketName: string, videoKey: string, downloadfilePath: string) => {
    const params = {Bucket: bucketName, Key: videoKey};
    const command = new GetObjectCommand(params);
    try {
        const data = await s3Client.send(command);
        if (!data.Body) {
            throw new Error('No data received from S3');
        }
        const stream = data.Body as Readable;
        
        return new Promise<string>((resolve, reject) => {
            const file = createWriteStream(downloadfilePath);
            stream.pipe(file);
            file.on('finish', () => { resolve(downloadfilePath); });
            file.on('error', reject);
        });
    } catch (error) {
        console.log('Error downloading video', error);
        throw error;
    }
}

export const uploadFromS3 = async (bucketName: string, videoKey: string, filePath: string) => {
    try {
        const fileContent = readFileSync(filePath);
        const uploadParams = {
            Bucket: bucketName, 
            Key: videoKey, 
            Body: fileContent
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        console.log('Video uploaded successfully');
    } catch (error) {
        console.log('Error uploading video', error);
        throw error;
    }
}

export const transcodeVideo = async (
    videoKey: string, 
    inputFile: string, 
    outputDir: string, 
    bucketName: string, 
    resolutions: string[]
): Promise<void> => {
    //transcode video
}