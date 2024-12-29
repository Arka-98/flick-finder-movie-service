import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { SeatType } from '../../theaters/schemas/seat-type.schema';
import { HydratedDocument } from 'mongoose';
import { Hall } from 'src/halls/schemas/hall.schema';

export type SeatDocument = HydratedDocument<Seat>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
    },
  },
})
export class Seat {
  @Prop()
  rowLabel: string;

  @Prop()
  seatPositions: number[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'SeatType' })
  seatType: SeatType;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Hall' })
  hall: Hall;
}

export const SeatSchema = SchemaFactory.createForClass(Seat);
