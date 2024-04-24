import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomStarValidator implements ValidatorConstraintInterface {
  validate(stars: number) {
    if (stars > 0 && stars <= 5) return true;
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be in between 1 to 5`;
  }
}
