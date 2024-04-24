import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    return value.trim().toLowerCase();
  })
  user: string;
}
