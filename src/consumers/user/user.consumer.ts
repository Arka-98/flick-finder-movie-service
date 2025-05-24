import { IUser, TOPICS } from '@flick-finder/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserConsumerService } from './user.service';

@Controller('consumers')
export class UserConsumerController {
  constructor(private readonly consumerService: UserConsumerService) {}

  @MessagePattern(TOPICS.USER.CREATED)
  async handleUserCreated(@Payload() user: IUser) {
    this.consumerService.createUser(user);
  }

  @MessagePattern(TOPICS.USER.UPDATED)
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

  @MessagePattern(TOPICS.USER.DELETED)
  async handleUserDeleted(@Payload() userId: string) {
    this.consumerService.deleteUser(userId);
  }
}
