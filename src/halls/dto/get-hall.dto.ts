import { IdAndTimestampDto } from "@flick-finder/common";
import { ApiProperty } from "@nestjs/swagger";

export class GetHallDto extends IdAndTimestampDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    theater: string;

    @ApiProperty()
    totalSeats: number;
}