import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TheatersService } from './theaters.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { Types } from 'mongoose';
import { GetTheaterDto } from './dto/get-theater.dto';
import {
  CustomRequest,
  ParseObjectIdPipe,
  Roles,
  RolesEnum,
} from '@flick-finder/common';
import { CreateSeatTypesDto } from './dto/create-seat-types.dto';
import { SeatTypeService } from './seat-type.service';

@ApiBearerAuth()
@Roles(RolesEnum.ADMIN, RolesEnum.VENDOR)
@ApiTags('theaters')
@Controller('theaters')
export class TheatersController {
  constructor(
    private readonly theatersService: TheatersService,
    private readonly seatTypeService: SeatTypeService,
  ) {}

  @Get()
  @ApiOkResponse({
    type: GetTheaterDto,
    description: 'Get all theaters',
    isArray: true,
  })
  async findAllTheaters() {
    return this.theatersService.findAllTheaters();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    type: GetTheaterDto,
    description: 'Get theater by ID',
  })
  async findTheaterById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.theatersService.findTheaterById(id);
  }

  @Post()
  @ApiOkResponse({
    type: GetTheaterDto,
    description: 'Create new theater',
  })
  async createTheater(
    @Body() createTheaterDto: CreateTheaterDto,
    @Request() requset: CustomRequest,
  ) {
    return this.theatersService.createTheater({
      ...createTheaterDto,
      createdBy: Types.ObjectId.createFromHexString(requset.user.sub),
    });
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    type: GetTheaterDto,
    description: 'Update theater',
  })
  async updateTheater(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateTheaterDto: CreateTheaterDto,
    @Request() requset: CustomRequest,
  ) {
    return this.theatersService.updateTheater(id, {
      ...updateTheaterDto,
      createdBy: Types.ObjectId.createFromHexString(requset.user.sub),
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    description: 'Delete theater',
  })
  async deleteTheater(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.theatersService.deleteTheater(id);
  }

  @Post(':id/seat-types')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: [String] })
  createSeatTypes(
    @Body(new ParseArrayPipe({ items: String }))
    seatTypes: string[],
    @Param('id', ParseObjectIdPipe) theaterId: Types.ObjectId,
  ) {
    return this.theatersService.createSeatTypes(theaterId, seatTypes);
  }

  @Get(':id/seat-types')
  getSeatTypesByTheaterId(
    @Param('id', ParseObjectIdPipe) theaterId: Types.ObjectId,
  ) {
    return this.seatTypeService.getSeatTypesByTheaterId(theaterId);
  }
}
