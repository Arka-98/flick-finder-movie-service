import { SeatType } from '@apps/theaters/schemas/seat-type.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Showtime } from './showtime.schema';

export type SchemaDocument = HydratedDocument<SeatPricing>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (_, ret) {
      delete ret.__v;
    },
  },
})
export class SeatPricing {
  @Prop({ type: SchemaTypes.ObjectId, ref: SeatType.name })
  seatType: SeatType;

  @Prop({ type: SchemaTypes.ObjectId, ref: Showtime.name })
  showtime: Showtime;

  @Prop({ type: Number })
  price: number;
}

export const SeatPricingSchema = SchemaFactory.createForClass(SeatPricing);
