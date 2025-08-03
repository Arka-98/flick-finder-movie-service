import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Seat } from './schemas/seat.schema';
import { Model, Types } from 'mongoose';
import { CreateSeatDto } from './dto/create-seat.dto';
import { HallsService } from 'src/halls/halls.service';
import { SeatType } from '../theaters/schemas/seat-type.schema';
import { BulkCreateSeatsDto } from './dto/bulk-create-seats.dto';
import { SeatConfigurationDto } from './dto/seat-configuration.dto';
import { SeatTypeService } from 'src/theaters/seat-type.service';
import { KafkaService, TOPICS } from '@flick-finder/common';

@Injectable()
export class SeatsService {
  constructor(
    @InjectModel(Seat.name) private readonly seatModel: Model<Seat>,
    @InjectModel(SeatType.name) private readonly seatTypeModel: Model<SeatType>,
    private readonly hallsService: HallsService,
    private readonly seatTypeService: SeatTypeService,
    private readonly kafkaService: KafkaService,
  ) {}

  async findAllSeats() {
    return this.seatModel.find();
  }

  async findSeatsByHallId(hallId: string) {
    return this.seatModel.find({ hall: hallId });
  }

  async createSeat(seat: CreateSeatDto) {
    if (
      !(await this.hallsService.findOne(
        Types.ObjectId.createFromHexString(seat.hall),
      ))
    ) {
      throw new NotFoundException('Hall not found');
    }

    if (
      !(await this.seatTypeService.getSeatTypeById(
        Types.ObjectId.createFromHexString(seat.seatType),
      ))
    ) {
      throw new NotFoundException('Seat type not found');
    }

    const createdSeat = await this.seatModel.create(seat);

    this.kafkaService.emit(TOPICS.SEAT.CREATED, {
      key: createdSeat.id,
      value: createdSeat.toObject(),
    });

    return seat;
  }

  async bulkCreateSeats(bulkCreateSeatsDto: BulkCreateSeatsDto[]) {
    const promises = bulkCreateSeatsDto.map(({ hallId, seatConfiguration }) =>
      this.validateSeatTypeAndCreateSeats(hallId, seatConfiguration),
    );

    return Promise.all(promises);
  }

  private async validateSeatTypeAndCreateSeats(
    hallId: string,
    seatConfiguration: SeatConfigurationDto[],
  ) {
    const seatTypeIds = seatConfiguration.reduce(
      (acc, config) => [...new Set([...acc, config.seatTypeId])],
      [],
    );
    const totalSeatPositions = seatConfiguration.reduce(
      (acc, config) => acc + config.seatPositions.length,
      0,
    );
    const hall = await this.hallsService.findOne(
      Types.ObjectId.createFromHexString(hallId),
    );

    if (hall.totalSeats !== totalSeatPositions) {
      throw new UnprocessableEntityException(
        'The total number of seat numbers does not match the total number of rows',
      );
    }

    const seatTypes = await this.seatTypeService.getSeatTypesByTheaterId(
      Types.ObjectId.createFromHexString(hall.theater.toString()),
    );

    if (
      seatTypes.some(({ _id }) => !seatTypeIds.includes(_id.toString())) ||
      seatTypeIds.length !== seatTypes.length
    ) {
      throw new UnprocessableEntityException(
        'Seat type IDs do not belong to the theater',
      );
    }

    const seatCreateRows = seatConfiguration.flatMap(
      ({ rowLabel, seatPositions, seatTypeId }) =>
        seatPositions.map((seatNumber) => ({
          seatLabel: `${rowLabel}${seatNumber}`,
          seatType: Types.ObjectId.createFromHexString(seatTypeId),
          hall: Types.ObjectId.createFromHexString(hallId),
        })),
    );
    const seats = await this.seatModel.insertMany(seatCreateRows);

    seats.forEach((seat) =>
      this.kafkaService.emit(TOPICS.SEAT.CREATED, {
        key: seat.id.toString(),
        value: seat.toObject(),
      }),
    );

    return seats;
  }
}
