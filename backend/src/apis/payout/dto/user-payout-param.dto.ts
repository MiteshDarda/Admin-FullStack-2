import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserPayoutParamDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  readonly email: string;
}
