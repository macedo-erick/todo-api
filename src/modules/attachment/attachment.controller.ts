import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { dirname, join } from 'path';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadAttachmentDto } from './dto/upload-attachment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Attachment } from '../board/models/attachment.model';

const MAX_SIZE = 1024 * 1024 * 100;

@Controller('attachments')
@ApiTags('Attachments')
export class AttachmentController {
  private readonly rootPath = dirname(require.main.filename);
  private readonly bucketName = this.configService.get('BUCKET_NAME');
  private readonly serviceKey = join(
    this.rootPath,
    'assets',
    'account-key.json',
  );

  storage = new Storage({
    keyFilename: this.serviceKey,
    projectId: this.configService.get('GCP_PROJECT_ID'),
  });

  constructor(
    private readonly attachmentService: AttachmentService,
    private configService: ConfigService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() uploadAttachmentDto: UploadAttachmentDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: MAX_SIZE })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<Attachment> {
    return this.attachmentService.uploadFile(file);
  }

  @Get('/:key')
  async downloadFile(
    @Param('key') key: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const fileContent = await this.attachmentService.downloadFile(key);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${key}"`,
    });

    return new StreamableFile(fileContent);
  }

  @Delete('/:key')
  deleteFile(@Param('key') key: string): Promise<unknown> {
    return this.attachmentService.deleteFile(key);
  }
}
