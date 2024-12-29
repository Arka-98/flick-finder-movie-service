import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateHallDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  totalSeats: number;
}
