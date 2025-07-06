import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { geKafkaMicroserviceOptions } from '@flick-finder/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const config = new DocumentBuilder()
    .setTitle('Flick Finder Movie Service')
    .setDescription('Flick Finder Movie REST API specification')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.connectMicroservice(
    geKafkaMicroserviceOptions(
      configService.get('KAFKA_BROKER'),
      configService.get('KAFKA_CLIENT_ID'),
      configService.get('KAFKA_GROUP_ID'),
    ),
  );

  SwaggerModule.setup('api/v1', app, document);

  await app.startAllMicroservices();
  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
