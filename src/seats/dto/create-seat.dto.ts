import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayUnique,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateSeatDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  rowLabel: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
  @ArrayUnique()
  @ArrayMinSize(1)
  @ApiProperty({ type: [Number] })
  seatPositions: number[];

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  seatType: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  hall: string;
}
