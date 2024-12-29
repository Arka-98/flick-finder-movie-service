import { IsMongoId, IsNumber, IsString } from 'class-validator';
import { UpdateHallDto } from './update-hall.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateHallDto extends UpdateHallDto {
  @IsMongoId()
  @ApiProperty()
  theaterId: Types.ObjectId;

  @IsString()
  @ApiProperty()
  name: string;

  @IsNumber()
  @ApiProperty()
  totalSeats: number;
}
