import { IsNotEmpty, IsString, NotContains } from 'class-validator';

export class ChangePassDto {
  @IsNotEmpty()
  @IsString()
  @NotContains(' ', { message: 'Password must not contain spaces' })
  readonly old: string;

  @IsNotEmpty()
  @IsString()
  @NotContains(' ', { message: 'Password must not contain spaces' })
  readonly new: string;
}
