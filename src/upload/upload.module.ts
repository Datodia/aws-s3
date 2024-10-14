import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';

@Module({
    imports: [],
    exports: [UploadService],
    providers: [UploadService]
})
export class UploadModule {}
