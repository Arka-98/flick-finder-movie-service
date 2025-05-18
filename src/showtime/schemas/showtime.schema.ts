import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Hall } from 'src/halls/schemas/hall.schema';
import { Movie } from 'src/movies/schemas/movie.schema';

export type SchemaDocument = HydratedDocument<Showtime>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (_, ret) {
      delete ret.__v;
    },
  },
})
export class Showtime {
  @Prop({ type: SchemaTypes.ObjectId, ref: Movie.name })
  movie: Movie;

  @Prop({ type: SchemaTypes.ObjectId, ref: Hall.name })
  hall: Hall;

  @Prop({ type: Date })
  showtime: Date;

  @Prop({ type: Number })
  availableSeats: number;
}

export const ShowtimeSchema = SchemaFactory.createForClass(Showtime);
