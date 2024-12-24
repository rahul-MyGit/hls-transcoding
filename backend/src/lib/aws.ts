import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "../config";


export const bucketName = "hls.rahulgujjar"
export const region = "us-east-1"


const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});

export const getPreSignUrl = async (key: string, expires: number = 800) => {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key
    });

    try {
        const url = await getSignedUrl(s3Client, command, { expiresIn: expires });
        return url;
    } catch (error) {
        console.log('Error getting presign url', error);
        return null;
    }
}