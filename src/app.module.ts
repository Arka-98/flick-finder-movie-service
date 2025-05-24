import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule, LoggerMiddleware } from '@flick-finder/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsumersModule } from './consumers/consumers.module';
import { MoviesModule } from './movies/movies.module';
import { TheatersModule } from './theaters/theaters.module';
import { HallsModule } from './halls/halls.module';
import { SeatsModule } from './seats/seats.module';
import { ShowtimeModule } from './showtime/showtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
        dbName: configService.get('MONGO_DB_NAME'),
      }),
      inject: [ConfigService],
    }),
    MoviesModule,
    TheatersModule,
    HallsModule,
    SeatsModule,
    CommonModule,
    ConsumersModule,
    ShowtimeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
