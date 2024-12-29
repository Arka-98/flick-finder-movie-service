import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Theater } from 'src/theaters/schemas/theater.schema';

export type HallDocument = HydratedDocument<Hall>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (_, ret) {
      delete ret.__v;
    },
  },
})
export class Hall {
  @Prop({ type: String })
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Theater.name })
  theater: Theater;

  @Prop({ type: Number })
  totalSeats: number;
}

export const HallSchema = SchemaFactory.createForClass(Hall);
