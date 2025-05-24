import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserEventDto } from '@flick-finder/common';

@Injectable()
export class UserConsumerService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  createUser(user: UserEventDto) {
    return this.userModel.create(user);
  }

  updateUser(userId: string, userUpdateBody: Omit<UserEventDto, '_id'>) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $set: userUpdateBody },
      { new: true },
    );
  }

  deleteUser(userId: string) {
    return this.userModel.deleteOne({ _id: userId });
  }
}
