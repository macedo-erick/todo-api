import { Global, Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { ConfigService } from '@nestjs/config';
import { AttachmentController } from './attachment.controller';

@Global()
@Module({
  providers: [AttachmentService, ConfigService],
  exports: [AttachmentService],
  controllers: [AttachmentController],
})
export class AttachmentModule {}
