import { Module } from '@nestjs/common';
import { ConsumersController } from './consumers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { ConsumerService } from './consumer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ConsumersController],
  providers: [ConsumerService],
})
export class ConsumersModule {}
