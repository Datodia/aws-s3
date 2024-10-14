import { Body, Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { UploadService } from './upload/upload.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File){
    const type = file.mimetype.split('/')[1]
    const filePath = `uploads/${new Date().getTime()}.${type}`
    await this.appService.uploadImage(filePath, file.buffer)

    return this.downloadImage(filePath)
  }


  @Post('upload-many')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadMany(@UploadedFiles() files: Express.Multer.File[]){
    console.log(files, "files")
    const uploadedFiles = []
    for(const file of files){
      const type = file.mimetype.split('/')[1]
      const filePath = `uploads/${new Date().getTime()}.${type}`
      await this.appService.uploadImage(filePath, file.buffer)
      uploadedFiles.push(filePath)
    }

    const dowloadableImages = []
    for(const path of uploadedFiles){
      const imgUrl = await this.downloadImage(path)
      dowloadableImages.push(imgUrl)
    }

    return dowloadableImages
  }

  @Post('/download')
  downloadImage(@Body('path') path){
    return this.appService.downloadImage(path)
  }

  @Post('delete')
  deleteImage(@Body('path') path){
    return this.appService.deleteImg(path)
  }
}
