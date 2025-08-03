import { Module } from '@nestjs/common';
import { HallsService } from './halls.service';
import { HallsController } from './halls.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hall, HallSchema } from './schemas/hall.schema';
import { TheatersModule } from 'src/theaters/theaters.module';
import { KafkaModule } from '@flick-finder/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hall.name, schema: HallSchema }]),
    TheatersModule,
    KafkaModule,
  ],
  controllers: [HallsController],
  providers: [HallsService],
  exports: [HallsService],
})
export class HallsModule {}
