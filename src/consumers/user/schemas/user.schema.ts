import { IUser, RolesEnum } from '@flick-finder/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (_, ret) {
      delete ret.__v;
    },
  },
})
export class User implements Pick<IUser, 'name' | 'email' | 'phone' | 'role'> {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ enum: RolesEnum, default: RolesEnum.CUSTOMER })
  role: RolesEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
