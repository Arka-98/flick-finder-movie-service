import { Module } from '@nestjs/common';
import { SeatsController } from './seats.controller';
import { SeatsService } from './seats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Seat, SeatSchema } from './schemas/seat.schema';
import { HallsModule } from 'src/halls/halls.module';
import { TheatersModule } from 'src/theaters/theaters.module';
import { KafkaModule } from '@flick-finder/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Seat.name, schema: SeatSchema }]),
    HallsModule,
    TheatersModule,
    KafkaModule,
  ],
  controllers: [SeatsController],
  providers: [SeatsService],
})
export class SeatsModule {}
