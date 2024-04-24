import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { CustomStarValidator } from './custom/custom-start-validator';

export class CompleteUserTaskDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  @Validate(CustomStarValidator)
  readonly delivery: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  @Validate(CustomStarValidator)
  readonly quality: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  @Validate(CustomStarValidator)
  readonly communication: number;
}
