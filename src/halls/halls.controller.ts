import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HallsService } from './halls.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { Types } from 'mongoose';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@flick-finder/common';

@ApiBearerAuth()
@ApiTags('halls')
@Controller('halls')
export class HallsController {
  constructor(private readonly hallsService: HallsService) {}

  @Post()
  @ApiOkResponse({ type: CreateHallDto, description: 'Create a new hall' })
  create(@Body() createHallDto: CreateHallDto) {
    return this.hallsService.create(createHallDto);
  }

  @Get()
  @ApiResponse({
    type: CreateHallDto,
    isArray: true,
    description: 'Get all halls',
  })
  findAll() {
    return this.hallsService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ type: CreateHallDto, description: 'Get a single hall' })
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.hallsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ type: CreateHallDto, description: 'Update a hall' })
  update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateHallDto: UpdateHallDto,
  ) {
    return this.hallsService.update(id, updateHallDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ type: CreateHallDto, description: 'Delete a hall' })
  remove(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.hallsService.deleteById(id);
  }
}
