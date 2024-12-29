import { TOPICS } from '@flick-finder/common';
import { Controller, UseGuards } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

@Controller('consumers')
export class ConsumersController {
  @EventPattern(TOPICS.USER.CREATED)
  async handleUserCreated(@Payload() user: any, @Ctx() context: KafkaContext) {
    console.log(user, context.getMessage().headers);
  }
}
