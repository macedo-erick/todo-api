import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { BoardModule } from './modules/board/board.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EncryptModule } from './common/modules/encrypt/encrypt.module';
import mongodbConfig from './common/config/mongodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongodbConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => ({
        uri: configService.get('mongodb.uri'),
      }),
    }),
    UserModule,
    BoardModule,
    EncryptModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
