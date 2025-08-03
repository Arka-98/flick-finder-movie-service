import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Hall } from './schemas/hall.schema';
import { Model, Types } from 'mongoose';
import { TheatersService } from 'src/theaters/theaters.service';
import { KafkaService, TOPICS } from '@flick-finder/common';

@Injectable()
export class HallsService {
  constructor(
    @InjectModel(Hall.name) private readonly hallModel: Model<Hall>,
    private readonly theaterService: TheatersService,
    private readonly kafkaService: KafkaService,
  ) {}

  async create(createHallDto: CreateHallDto) {
    if (
      !(await this.theaterService.findTheaterById(
        new Types.ObjectId(createHallDto.theaterId),
      ))
    ) {
      throw new Error('Theater not found');
    }

    const createdHall = await this.hallModel.create({
      ...createHallDto,
      theater: createHallDto.theaterId,
    });

    this.kafkaService.emit(TOPICS.HALL.CREATED, {
      key: createdHall.id,
      value: createdHall.toObject(),
    });

    return;
  }

  findAll() {
    return this.hallModel.find();
  }

  async findOne(id: Types.ObjectId) {
    const hall = await this.hallModel.findById(id);

    if (!hall) {
      throw new NotFoundException('Hall not found');
    }

    return hall;
  }

  async update(id: Types.ObjectId, updateHallDto: UpdateHallDto) {
    const updatedHall = await this.hallModel.findByIdAndUpdate(
      id,
      updateHallDto,
    );

    if (!updatedHall) {
      throw new NotFoundException('Hall not found');
    }

    this.kafkaService.emit(TOPICS.HALL.UPDATED, {
      key: id.toString(),
      value: updatedHall.toObject(),
    });

    return updatedHall;
  }

  deleteById(id: Types.ObjectId) {
    this.kafkaService.emit(TOPICS.HALL.DELETED, {
      key: id.toString(),
      value: id.toString(),
    });

    return this.hallModel.findByIdAndDelete(id);
  }
}
