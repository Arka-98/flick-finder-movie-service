import { IdAndTimestampDto } from '@flick-finder/common';
import { ApiProperty } from '@nestjs/swagger';

export class GetShowtimeDto extends IdAndTimestampDto {
  @ApiProperty()
  movie: string;

  @ApiProperty()
  hall: string;

  @ApiProperty()
  showtime: string;
}
