import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_ACCESS_KEY } from "../config";
import { createWriteStream, readFileSync } from "fs";
import { Readable } from 'stream';
import path from "path";
import fs from "fs";
import { exec } from "child_process";

export const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});

export const downloadFromS3 = async (bucketName: string, videoKey: string, downloadfilePath: string) => {
    const params = { Bucket: bucketName, Key: videoKey };
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

export const uploadToS3 = async (bucketName: string, videoKey: string, filePath: string) => {
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
) => {
    try {
        for (const res of resolutions) {
            const hlsPath = path.join(outputDir, `hls_${res}p`);
            const outputPath = path.join(outputDir, `output_${res}p`);
            fs.mkdirSync(outputPath, { recursive: true });

            const command = `ffmpeg -i ${inputFile} -vf "scale=-2:${res}" -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}.m3u8`;

            await new Promise((resolve, reject) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(stdout);
                    }
                })
            })

            await uploadToS3(`${hlsPath}.m3u8`, bucketName, `${videoKey}/output_${res}p/hls_${res}.m3u8`);

            const segmentsFiles = fs.readdirSync(outputPath).filter((file) => file.endsWith(".ts"));

            for (const segment of segmentsFiles) {
                await uploadToS3(path.join(outputPath, segment), bucketName, `${videoKey}/output_${res}p/${segment}`);
            }
        }
    } catch (error) {
        console.log('Error transcoding video', error);
        throw error;
    }
}