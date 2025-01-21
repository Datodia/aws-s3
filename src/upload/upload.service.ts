import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { Readable } from 'stream';


@Injectable()
export class UploadService {
    private storageService;
    private bucketName


    constructor(){
        this.bucketName = process.env.AWS_BUCKET_NAME
        this.storageService = new S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
            },
            region: process.env.AWS_REGION
        })
    }


    async uploadImage(filePath: string, fileBuffer: Buffer){
        if(!filePath || !fileBuffer) throw new BadRequestException('File is required')
        try{
            const config = {
                Key: filePath,
                Bucket: this.bucketName,
                Body: fileBuffer
            }
            const uploadCommand = new PutObjectCommand(config)
            await this.storageService.send(uploadCommand)
            return filePath
        }catch(e){
            throw new BadRequestException('Could not upload file')
        }
    }


    async downloadImage(filePath: string){
        if(!filePath) return
        const config = {
            Bucket: this.bucketName,
            Key: filePath
        }
        const getCommand = new GetObjectCommand(config)
        const fileStream = await this.storageService.send(getCommand)

       if (fileStream.Body instanceof Readable) {
            const chunks = []
            for await (const chunk of fileStream.Body) {
                chunks.push(chunk)
            }
            const fileBuffer = Buffer.concat(chunks)
            const b64 = fileBuffer.toString('base64')
            const file = `data:${fileStream.ContentType};base64,${b64}`
            return file
        }   
    }

    async deleteImg(filePath: string){
        if(!filePath) throw new BadRequestException('File path is required')
        const config = {
            Bucket: this.bucketName,
            Key: filePath
        } 
        const deleteCommand = new DeleteObjectCommand(config)
        await this.storageService.send(deleteCommand)
        return 'deleted successfully'
    }

}
