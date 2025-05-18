import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ShowtimeService } from './showtime.service';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from '@flick-finder/common';
import { GetShowtimeDto } from './dto/get-showtime.dto';

@ApiBearerAuth()
@ApiTags('showtime')
@Controller('showtime')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Get()
  @ApiOkResponse({
    type: [GetShowtimeDto],
    description: 'Get all showtimes'
  })
  getAllShowtimes() {
    return this.showtimeService.getAllShowtimes();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  getShowtimeById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.showtimeService.getShowtimeById(id);
  }
}
