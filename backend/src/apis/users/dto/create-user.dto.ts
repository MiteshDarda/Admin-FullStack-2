import { IsEnum, IsNotEmpty, IsString, NotContains } from 'class-validator';
import { DesignationEnum } from '../enums/DesignationEnum';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @NotContains(' ', { message: 'Password must not contain spaces' })
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(DesignationEnum)
  readonly designation: DesignationEnum;
}
