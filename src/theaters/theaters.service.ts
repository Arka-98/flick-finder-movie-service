import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Theater } from './schemas/theater.schema';
import { Model, Types } from 'mongoose';
import { SeatType } from './schemas/seat-type.schema';
import { CreateSeatTypesDto } from './dto/create-seat-types.dto';
import { KafkaService, TOPICS } from '@flick-finder/common';

@Injectable()
export class TheatersService {
  constructor(
    @InjectModel(Theater.name) private readonly theaterModel: Model<Theater>,
    @InjectModel(SeatType.name) private readonly seatTypeModel: Model<SeatType>,
    private readonly kafkaService: KafkaService,
  ) {}

  async findAllTheaters() {
    return this.theaterModel.find();
  }

  async findTheaterById(id: Types.ObjectId) {
    return this.theaterModel.findById(id);
  }

  async createTheater(theater: Theater) {
    const newTheater = await this.theaterModel.create(theater);

    this.kafkaService.emit(TOPICS.THEATER.CREATED, {
      key: newTheater.id,
      value: newTheater.toObject(),
    });

    return newTheater;
  }

  async updateTheater(id: Types.ObjectId, theater: Theater) {
    const updatedTheater = await this.theaterModel.findByIdAndUpdate(
      id,
      theater,
      { new: true },
    );

    this.kafkaService.emit(TOPICS.THEATER.UPDATED, {
      key: id.toString(),
      value: updatedTheater.toObject(),
    });

    return updatedTheater;
  }

  async deleteTheater(id: Types.ObjectId) {
    this.kafkaService.emit(TOPICS.THEATER.DELETED, {
      key: id.toString(),
      value: id.toString(),
    });

    return this.theaterModel.findByIdAndDelete(id);
  }

  async createSeatTypes(theaterId: Types.ObjectId, seatTypes: string[]) {
    const newSeatTypes = await this.seatTypeModel.insertMany(
      seatTypes.map((createSeatTypeDto) => ({
        type: createSeatTypeDto,
        theater: theaterId,
      })),
    );

    newSeatTypes.forEach((seatType) =>
      this.kafkaService.emit(TOPICS.SEAT_TYPE.CREATED, {
        key: seatType.id.toString(),
        value: seatType.toObject(),
      }),
    );

    return newSeatTypes;
  }
}
