import { ApiProperty } from '@nestjs/swagger';

export class SeatPricingDto {
  @ApiProperty()
  seatType: string;

  @ApiProperty()
  showtime: string;

  @ApiProperty()
  price: number;
}
