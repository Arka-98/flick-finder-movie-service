import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Showtime } from './schemas/showtime.schema';
import { Model, Types } from 'mongoose';
import { CreateSeatPricingDto } from './dto/create-seat-pricing.dto';
import { SeatPricing } from './schemas/seat-pricing.schema';
import { SeatTypeService } from '@apps/theaters/seat-type.service';
import { KafkaService, StripeService, TOPICS } from '@flick-finder/common';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectModel(Showtime.name) private readonly showtimeModel: Model<Showtime>,
    @InjectModel(SeatPricing.name)
    private readonly seatPricingModel: Model<SeatPricing>,
    private readonly seatTypeService: SeatTypeService,
    private readonly kafkaService: KafkaService,
    private readonly stripeService: StripeService,
  ) {}

  getAllShowtimes() {
    return this.showtimeModel.find();
  }

  getShowtimeById(showtimeId: Types.ObjectId) {
    return this.showtimeModel.findById(showtimeId).populate('movie');
  }

  async addPriceForShowtime(
    showtimeId: Types.ObjectId,
    { seatTypeId, price }: CreateSeatPricingDto,
  ) {
    const [showtime, seatType] = await Promise.all([
      this.getShowtimeById(showtimeId),
      this.seatTypeService.getSeatTypeById(
        Types.ObjectId.createFromHexString(seatTypeId),
      ),
    ]);

    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }

    if (!seatType) {
      throw new NotFoundException('Seat type not found');
    }

    const seatPricing = await this.seatPricingModel.create({
      seatType: Types.ObjectId.createFromHexString(seatTypeId),
      price: Number(price),
      showtime: showtimeId,
      active: false,
    });
    const { product, price: stripePrice } =
      await this.stripeService.createProductAndPrice(
        {
          name: `Movie: ${showtime.movie.title} - Seat Type: ${seatType.type} - Showtime: ${showtime.showtime.toString()}`,
        },
        { currency: 'inr', unit_amount: Number(price) },
      );

    await this.seatPricingModel.findByIdAndUpdate(seatPricing.id, {
      stripePriceId: stripePrice.id,
      stripeProductId: product.id,
      active: true,
    });

    this.kafkaService.emit(TOPICS.SEAT_PRICING.CREATED, {
      key: seatPricing.id,
      value: seatPricing.toObject(),
    });

    return seatPricing;
  }
}
