import { IUser } from '@flick-finder/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserConsumerService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  createUser(user: IUser) {
    return this.userModel.create(user);
  }

  updateUser(userId: string, userUpdateBody: Partial<IUser>) {
    return this.userModel.updateOne({ _id: userId }, userUpdateBody);
  }

  deleteUser(userId: string) {
    return this.userModel.deleteOne({ _id: userId });
  }
}
