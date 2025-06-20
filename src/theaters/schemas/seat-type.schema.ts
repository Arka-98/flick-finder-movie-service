import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Theater } from 'src/theaters/schemas/theater.schema';

export type SeatTypeDocument = HydratedDocument<SeatType>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
    },
  },
})
export class SeatType {
  @Prop()
  type: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Theater' })
  theater: Theater;
}

export const SeatTypeSchema = SchemaFactory.createForClass(SeatType);
