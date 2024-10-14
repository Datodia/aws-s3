import { Injectable } from '@nestjs/common';
import { UploadService } from './upload/upload.service';

@Injectable()
export class AppService {
  constructor(private uploadService: UploadService){}
  getHello(): string {
    return 'Hello World!';
  }


  downloadImage(filePath: string){
    return this.uploadService.downloadImage(filePath)
  }

  uploadImage(filePath: string, buffer: Buffer){
    return this.uploadService.uploadImage(filePath, buffer)
  }

  deleteImg(filePath: string){
    return this.uploadService.deleteImg(filePath)
  }
}
