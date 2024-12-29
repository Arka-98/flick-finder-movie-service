import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsMobilePhone,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTheaterDto {
  @IsString()
  @MaxLength(30)
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsMobilePhone('en-IN')
  @ApiProperty()
  phone: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsDateString()
  @ApiProperty()
  establishedAt: Date;
}
