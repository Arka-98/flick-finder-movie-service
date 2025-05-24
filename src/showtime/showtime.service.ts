import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Showtime } from './schemas/showtime.schema';
import { Model, Types } from 'mongoose';
import { CreateSeatPricingDto } from './dto/create-seat-pricing.dto';
import { SeatPricing } from './schemas/seat-pricing.schema';
import { SeatTypeService } from '@apps/theaters/seat-type.service';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectModel(Showtime.name) private readonly showtimeModel: Model<Showtime>,
    @InjectModel(SeatPricing.name)
    private readonly seatPricingModel: Model<SeatPricing>,
    private readonly seatTypeService: SeatTypeService,
  ) {}

  getAllShowtimes() {
    return this.showtimeModel.find();
  }

  getShowtimeById(showtimeId: Types.ObjectId) {
    return this.showtimeModel.findById(showtimeId);
  }

  async addPriceForShowtime(
    showtimeId: Types.ObjectId,
    seatPricingDto: CreateSeatPricingDto,
  ) {
    const [showtime, seatType] = await Promise.all([
      this.getShowtimeById(showtimeId),
      this.seatTypeService.getSeatTypeById(
        Types.ObjectId.createFromHexString(seatPricingDto.seatTypeId),
      ),
    ]);

    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }

    if (!seatType) {
      throw new NotFoundException('Seat type not found');
    }

    return this.seatPricingModel.create({
      ...seatPricingDto,
      showtime: showtimeId,
    });
  }
}
