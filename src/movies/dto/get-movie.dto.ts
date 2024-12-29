import { ApiProperty } from '@nestjs/swagger';

export class GetMovieDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  director: string;

  @ApiProperty()
  cast: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
