import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EncryptService {
  constructor(private configService: ConfigService) {}

  encrypt(str: string) {
    return bcrypt.hashSync(
      str,
      parseInt(this.configService.get('SALT_ROUNDS')),
    );
  }

  compare(str: string, hash: string) {
    return bcrypt.hashSync(str, hash);
  }
}
