import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTasksDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  readonly title: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  readonly description: string;

  @IsNotEmpty()
  @IsDate()
  readonly estimatedCompletion: Date;
}
