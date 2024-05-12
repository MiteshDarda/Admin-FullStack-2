import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsMonthValidConstraint } from './custom/month.validator';
import { IsValidYearConstraint } from './custom/year.validator';

export class UserPayoutBodyDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  readonly taskIdOrTitle: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  @Validate(IsMonthValidConstraint)
  readonly month: number;

  @IsNotEmpty()
  @IsDate()
  readonly from: Date;

  @IsNotEmpty()
  @IsDate()
  readonly to: Date;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  @Validate(IsValidYearConstraint)
  readonly year: number;
}
