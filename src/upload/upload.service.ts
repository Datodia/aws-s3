import { BadRequestException, Body, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk'


@Injectable()
export class UploadService {
    private storageService;
    private bucketName


    constructor(){
        this.bucketName = process.env.AWS_BUCKET_NAME
        this.storageService = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
            region: 'eu-north-1'
        })
    }


    async uploadImage(name: string, fileBuffer: Buffer){
        try{
            const config = {
                Key: name,
                Bucket: this.bucketName,
                Body: fileBuffer
            }

            return this.storageService.putObject(config).promise()
        }catch(e){
            throw new BadRequestException('Could not upload file')
        }
    }


    async downloadImage(filePath: string){
        const config = {
            Bucket: this.bucketName,
            Key: filePath
        }
        return this.storageService.getSignedUrlPromise('getObject', config)
    }


    async deleteImg(filePath){
        if(!filePath) return
        const config = {
            Bucket: this.bucketName,
            Key: filePath
        } 

        await this.storageService.deleteObject(config).promise()

        return 'deleted successfully'
    }

}
