import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsMongoId,
  IsNumber,
  IsString,
  IsUppercase,
  Length,
} from 'class-validator';

export class SeatConfigurationDto {
  @IsString()
  @Length(1, 1)
  @IsUppercase()
  @ApiProperty()
  rowLabel: string;

  @IsMongoId()
  @ApiProperty()
  seatTypeId: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
  @ArrayUnique()
  @ArrayMinSize(1)
  @ApiProperty({ type: [Number] })
  seatPositions: number[];
}
