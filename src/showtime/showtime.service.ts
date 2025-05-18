import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Showtime } from './schemas/showtime.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectModel(Showtime.name) private readonly showtimeModel: Model<Showtime>,
  ) {}

  getAllShowtimes() {
    return this.showtimeModel.find();
  }

  getShowtimeById(showtimeId: Types.ObjectId) {
    return this.showtimeModel.findById(showtimeId);
  }
}
