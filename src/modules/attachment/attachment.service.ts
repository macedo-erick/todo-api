import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { dirname, join } from 'path';
import { File, Storage } from '@google-cloud/storage';
import { Attachment } from '../board/models/attachment.model';

@Injectable()
export class AttachmentService {
  private readonly rootPath = dirname(require.main.filename);
  private readonly bucketName = this.configService.get('BUCKET_NAME');

  storageCredentials = Buffer.from(
    this.configService.get<string>('STORAGE_CREDENTIALS'),
    'base64',
  ).toString('utf8');

  credentials: any = JSON.parse(this.storageCredentials);

  storage = new Storage({
    projectId: this.credentials.projetct_id,
    credentials: JSON.parse(this.storageCredentials),
  });

  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File): Promise<Attachment> {
    const { originalname, buffer } = file;

    const fileName = this.formatFileName(originalname);

    await this.storage.bucket(this.bucketName).file(fileName).save(buffer);

    return {
      fileName: originalname,
      key: fileName,
      url: this.getObjectUrl(fileName),
      uploadedDate: new Date(),
    };
  }

  async downloadFile(key: string): Promise<File> {
    return this.storage.bucket(this.bucketName).file(key);
  }

  deleteFile(key: string): Promise<unknown> {
    return this.storage
      .bucket(this.bucketName)
      .file(key)
      .delete({ ignoreNotFound: true });
  }

  private formatFileName(fileName: string): string {
    return uuid().concat('.', fileName.split('.')[1]);
  }

  private getObjectUrl(fileName: string): string {
    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }
}
