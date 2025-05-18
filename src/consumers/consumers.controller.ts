import { IUser, TOPICS } from '@flick-finder/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ConsumerService } from './consumer.service';

@Controller('consumers')
export class ConsumersController {
  constructor(private readonly consumerService: ConsumerService) {}

  @EventPattern(TOPICS.USER.CREATED)
  async handleUserCreated(@Payload() user: IUser) {
    this.consumerService.createUser(user);
  }

  @EventPattern(TOPICS.USER.UPDATED)
  async handleUserUpdated(
    @Payload()
    {
      userId,
      userUpdateBody,
    }: {
      userId: string;
      userUpdateBody: Partial<IUser>;
    },
  ) {
    this.consumerService.updateUser(userId, userUpdateBody);
  }

  @EventPattern(TOPICS.USER.DELETED)
  async handleUserDeleted(@Payload() userId: string) {
    this.consumerService.deleteUser(userId);
  }
}
