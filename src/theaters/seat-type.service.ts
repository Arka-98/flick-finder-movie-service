import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SeatType } from './schemas/seat-type.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class SeatTypeService {
  constructor(
    @InjectModel(SeatType.name) private readonly seatTypeModel: Model<SeatType>,
  ) {}

  getAllSeatTypes() {
    return this.seatTypeModel.find();
  }

  getSeatTypeById(id: Types.ObjectId) {
    return this.seatTypeModel.findById(id);
  }

  getSeatTypesByTheaterId(theaterId: Types.ObjectId) {
    return this.seatTypeModel.find({ theater: theaterId });
  }

  async getSeatTypeByIdAndTheaterId(
    id: Types.ObjectId,
    theaterId: Types.ObjectId,
  ) {
    const seatType = await this.seatTypeModel.findOne({
      _id: id,
      theater: theaterId,
    });

    if (!seatType) {
      throw new NotFoundException('Seat type not found');
    }

    return seatType;
  }
}
