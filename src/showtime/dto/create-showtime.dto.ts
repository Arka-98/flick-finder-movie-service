import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateShowtimeDto {
  @IsMongoId()
  @ApiProperty()
  hall: Types.ObjectId;

  @IsDateString()
  @ApiProperty()
  showtime: string;
}
