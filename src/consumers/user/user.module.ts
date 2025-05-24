import { Module } from '@nestjs/common';
import { UserConsumerController } from './user.consumer';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserConsumerService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserConsumerController],
  providers: [UserConsumerService],
})
export class UserConsumerModule {}
