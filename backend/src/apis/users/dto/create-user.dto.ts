import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  NotContains,
} from 'class-validator';
import { DesignationEnum } from '../enums/DesignationEnum';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @NotContains(' ', { message: 'Password must not contain spaces' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(DesignationEnum)
  readonly designation: DesignationEnum;
}
