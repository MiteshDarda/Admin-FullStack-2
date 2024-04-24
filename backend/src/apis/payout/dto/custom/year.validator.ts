import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidYear', async: false })
export class IsValidYearConstraint implements ValidatorConstraintInterface {
  validate(year: number) {
    // Check if the year is a number and between a valid range
    return (
      typeof year === 'number' &&
      year >= 1900 &&
      year <= new Date().getFullYear()
    );
  }

  defaultMessage() {
    return 'Invalid year';
  }
}
