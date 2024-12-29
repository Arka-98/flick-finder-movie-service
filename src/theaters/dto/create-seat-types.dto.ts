import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsCurrency, IsMongoId, IsString } from 'class-validator';

export class CreateSeatTypesDto {
  @IsString()
  @ApiProperty()
  type: string;

  @IsCurrency()
  @ApiProperty()
  price: number;
}
