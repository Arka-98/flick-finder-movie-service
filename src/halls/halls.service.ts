import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Hall } from './schemas/hall.schema';
import { Model, Types } from 'mongoose';
import { TheatersService } from 'src/theaters/theaters.service';

@Injectable()
export class HallsService {
  constructor(
    @InjectModel(Hall.name) private readonly hallModel: Model<Hall>,
    private readonly theaterService: TheatersService,
  ) {}

  async create(createHallDto: CreateHallDto) {
    if (
      !(await this.theaterService.findTheaterById(
        new Types.ObjectId(createHallDto.theaterId),
      ))
    ) {
      throw new Error('Theater not found');
    }

    return this.hallModel.create({
      ...createHallDto,
      theater: createHallDto.theaterId,
    });
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

  update(id: Types.ObjectId, updateHallDto: UpdateHallDto) {
    return this.hallModel.findByIdAndUpdate(id, updateHallDto);
  }

  deleteById(id: Types.ObjectId) {
    return this.hallModel.findByIdAndDelete(id);
  }
}
