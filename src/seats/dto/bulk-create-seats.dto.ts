import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNumber,
  Validate,
  ValidateNested,
} from 'class-validator';
import { SeatConfigurationDto } from './seat-configuration.dto';
import { UniqueRowLabelsValidator } from 'src/validators/unique-row-labels.validator';
import { Type } from 'class-transformer';

export class BulkCreateSeatsDto {
  @IsMongoId()
  @ApiProperty()
  hallId: string;

  @Validate(UniqueRowLabelsValidator)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SeatConfigurationDto)
  @ApiProperty({ type: [SeatConfigurationDto] })
  seatConfiguration: SeatConfigurationDto[];
}
