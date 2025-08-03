import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @MaxLength(10)
  @ApiProperty()
  title: string;

  @IsDateString()
  @ApiProperty()
  releaseDate: string;

  @IsString()
  @ApiProperty()
  director: string;

  @IsNumber()
  @ApiProperty({ title: 'Duration in minutes' })
  duration: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiProperty()
  cast: string[];
}
