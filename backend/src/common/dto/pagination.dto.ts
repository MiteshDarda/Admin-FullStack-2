import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class Pagination {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  limit: number = 10;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  page: number = 1;
}
