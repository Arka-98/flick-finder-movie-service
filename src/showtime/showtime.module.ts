import { Module } from '@nestjs/common';
import { ShowtimeController } from './showtime.controller';
import { ShowtimeService } from './showtime.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Showtime, ShowtimeSchema } from './schemas/showtime.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Showtime.name, schema: ShowtimeSchema },
    ]),
  ],
  controllers: [ShowtimeController],
  providers: [ShowtimeService],
  exports: [MongooseModule],
})
export class ShowtimeModule {}
