import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Theater } from './schemas/theater.schema';
import { Model, Types } from 'mongoose';
import { SeatType } from './schemas/seat-type.schema';
import { CreateSeatTypesDto } from './dto/create-seat-types.dto';

@Injectable()
export class TheatersService {
  constructor(
    @InjectModel(Theater.name) private readonly theaterModel: Model<Theater>,
    @InjectModel(SeatType.name) private readonly seatTypeModel: Model<SeatType>,
  ) {}

  async findAllTheaters() {
    return this.theaterModel.find();
  }

  async findTheaterById(id: Types.ObjectId) {
    return this.theaterModel.findById(id);
  }

  async createTheater(theater: Theater) {
    return this.theaterModel.create(theater);
  }

  async updateTheater(id: Types.ObjectId, theater: Theater) {
    return this.theaterModel.findByIdAndUpdate(id, theater, {
      new: true,
    });
  }

  async deleteTheater(id: Types.ObjectId) {
    return this.theaterModel.findByIdAndDelete(id);
  }

  async createSeatTypes(
    theaterId: Types.ObjectId,
    createSeatTypesDto: CreateSeatTypesDto[],
  ) {
    return this.seatTypeModel.insertMany(
      createSeatTypesDto.map((createSeatTypeDto) => ({
        ...createSeatTypeDto,
        theater: theaterId,
      })),
    );
  }
}
