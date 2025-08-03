import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Theater, TheaterSchema } from './schemas/theater.schema';
import { TheatersController } from './theaters.controller';
import { TheatersService } from './theaters.service';
import { SeatType, SeatTypeSchema } from './schemas/seat-type.schema';
import { SeatTypeController } from './seat-type.controller';
import { SeatTypeService } from './seat-type.service';
import { KafkaModule } from '@flick-finder/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Theater.name, schema: TheaterSchema },
      { name: SeatType.name, schema: SeatTypeSchema },
    ]),
    KafkaModule,
  ],
  controllers: [TheatersController, SeatTypeController],
  providers: [TheatersService, SeatTypeService],
  exports: [TheatersService, SeatTypeService, MongooseModule],
})
export class TheatersModule {}
