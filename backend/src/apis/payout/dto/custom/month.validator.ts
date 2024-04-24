import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isMonthValid', async: false })
export class IsMonthValidConstraint implements ValidatorConstraintInterface {
  validate(month: number) {
    return month >= 1 && month <= 12;
  }

  defaultMessage() {
    return 'Month must be between 1 and 12';
  }
}
