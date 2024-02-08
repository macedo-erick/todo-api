import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { BoardModule } from './modules/board/board.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EncryptModule } from './common/modules/encrypt/encrypt.module';
import { JwtModule } from '@nestjs/jwt';

import mongodbConfig from './common/config/mongodb.config';
import jwtConfig from './common/config/jwt.config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongodbConfig, jwtConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongodb.uri'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: parseInt(configService.get('jwt.expires')),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    BoardModule,
    EncryptModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
