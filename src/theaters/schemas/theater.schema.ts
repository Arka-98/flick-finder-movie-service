import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { User } from '@apps/consumers/user/schemas/user.schema';

export type TheaterDocument = HydratedDocument<Theater>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (_, ret) {
      delete ret.__v;
    },
  },
})
export class Theater {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  createdBy: User | Types.ObjectId;

  @Prop({ type: Date })
  establishedAt: Date;
}

export const TheaterSchema = SchemaFactory.createForClass(Theater);
