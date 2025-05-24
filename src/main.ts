import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: configService.get('KAFKA_CLIENT_ID'),
          brokers: [configService.get('KAFKA_BROKER')],
        },
        consumer: {
          groupId: configService.get('KAFKA_GROUP_ID'),
        },
        subscribe: {
          fromBeginning: true,
        },
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  SwaggerModule.setup('api/v1', app, document);

  await app.startAllMicroservices();
  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
