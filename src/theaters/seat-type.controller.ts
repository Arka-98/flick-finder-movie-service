import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SeatTypeService } from './seat-type.service';
import { ParseObjectIdPipe } from '@flick-finder/common';
import { Types } from 'mongoose';

@ApiBearerAuth()
@ApiTags('seat-types')
@Controller('seat-types')
export class SeatTypeController {
  constructor(private readonly seatTypeService: SeatTypeService) {}

  @Get()
  getAllSeatTypes() {
    return this.seatTypeService.getAllSeatTypes();
  }

  @Get(':id')
  getSeatTypeById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.seatTypeService.getSeatTypeById(id);
  }
}
