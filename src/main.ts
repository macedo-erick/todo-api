import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvironmentsEnum } from './common/enums/Environments.enum';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const basePath = configService.get('BASE_PATH');

  const config = new DocumentBuilder()
    .setTitle('TODO API')
    .setDescription('The TODO API description')
    .setVersion('0.0.1-SNAPSHOT')
    .setLicense('GNU', 'https://choosealicense.com/licenses/lgpl-3.0/')
    .setContact('Erick Macedo', null, 'macedo.eriick@gmail.com')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const paths = Object.keys(document.paths).sort();

  document.paths = paths.reduce((acc, path) => {
    acc[path] = document.paths[path];
    return acc;
  }, {});

  if (configService.get('NODE_ENV') == EnvironmentsEnum.DEV) {
    SwaggerModule.setup(`${basePath}/swagger`, app, document);
  }

  app.use(cookieParser());

  app.enableCors({
    origin: configService.get('CORS_ORIGINS').split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(process.env.API_PORT);
}

bootstrap();
