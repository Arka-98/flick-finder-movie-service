import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SeatConfigurationDto } from 'src/seats/dto/seat-configuration.dto';

export class UniqueRowLabelsValidator implements ValidatorConstraintInterface {
  validate(
    value: SeatConfigurationDto[],
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const rowLabels = value.map((seat) => seat.rowLabel);

    return rowLabels.length === new Set(rowLabels).size;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Row labels must be unique';
  }
}
