import { ApiProperty } from '@nestjs/swagger';
import { IsCurrency, IsMongoId } from 'class-validator';

export class CreateSeatPricingDto {
  @IsMongoId()
  @ApiProperty()
  seatTypeId: string;

  @IsCurrency()
  @ApiProperty()
  price: string;
}
