import { Module } from '@nestjs/common';
import { ShowtimeController } from './showtime.controller';
import { ShowtimeService } from './showtime.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Showtime, ShowtimeSchema } from './schemas/showtime.schema';
import { SeatPricing, SeatPricingSchema } from './schemas/seat-pricing.schema';
import { TheatersModule } from '@apps/theaters/theaters.module';
import { KafkaModule } from '@flick-finder/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Showtime.name, schema: ShowtimeSchema },
      { name: SeatPricing.name, schema: SeatPricingSchema },
    ]),
    TheatersModule,
    KafkaModule,
  ],
  controllers: [ShowtimeController],
  providers: [ShowtimeService],
  exports: [MongooseModule],
})
export class ShowtimeModule {}
