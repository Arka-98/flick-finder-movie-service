import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
    },
  },
})
export class Movie {
  @Prop({ type: String })
  title: string;

  @Prop({ type: Date })
  releaseDate: Date;

  @Prop({ type: String })
  director: string;

  @Prop({ type: [String] })
  cast: string[];

  @Prop({ default: false })
  approved: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
