import { Global, Module } from '@nestjs/common';
import { EncryptService } from './encrypt.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [EncryptService, ConfigService],
  exports: [EncryptService],
})
export class EncryptModule {}
