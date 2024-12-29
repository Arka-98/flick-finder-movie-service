import { Body, Controller, Get, ParseArrayPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { BulkCreateSeatsDto } from './dto/bulk-create-seats.dto';

@ApiBearerAuth()
@ApiTags('seats')
@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get()
  getSeats() {
    return this.seatsService.findAllSeats();
  }

  @Post()
  createSeat(@Body() createSeatDto: CreateSeatDto) {
    return this.seatsService.createSeat(createSeatDto);
  }

  @Post('bulk-create')
  @ApiBody({ type: [BulkCreateSeatsDto] })
  bulkCreateSeats(
    @Body(new ParseArrayPipe({ items: BulkCreateSeatsDto }))
    bulkCreateSeatsDto: BulkCreateSeatsDto[],
  ) {
    return this.seatsService.bulkCreateSeats(bulkCreateSeatsDto);
  }
}
