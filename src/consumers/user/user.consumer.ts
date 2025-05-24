import { IUserEvent, Public, TOPICS, UserEventDto } from '@flick-finder/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserConsumerService } from './user.service';

@Public()
@Controller('consumers')
export class UserConsumerController {
  constructor(private readonly consumerService: UserConsumerService) {}

  @MessagePattern(TOPICS.USER.CREATED)
  async handleUserCreated(@Payload() user: UserEventDto) {
    return this.consumerService.createUser(user);
  }

  @MessagePattern(TOPICS.USER.UPDATED)
  async handleUserUpdated(@Payload() updatedUser: UserEventDto) {
    const { _id: userId, ...userUpdateBody } = updatedUser;

    return this.consumerService.updateUser(userId, userUpdateBody);
  }

  @MessagePattern(TOPICS.USER.DELETED)
  async handleUserDeleted(@Payload() userId: string) {
    return this.consumerService.deleteUser(userId);
  }
}
