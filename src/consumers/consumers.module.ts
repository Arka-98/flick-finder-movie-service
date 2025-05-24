import { Module } from '@nestjs/common';
import { UserConsumerModule } from './user/user.module';

@Module({
  imports: [UserConsumerModule],
})
export class ConsumersModule {}
