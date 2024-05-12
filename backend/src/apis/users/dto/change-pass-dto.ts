import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  NotContains,
} from 'class-validator';

export class ChangePassDto {
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @NotContains(' ', { message: 'Password must not contain spaces' })
  readonly old: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @NotContains(' ', { message: 'Password must not contain spaces' })
  readonly new: string;
}
