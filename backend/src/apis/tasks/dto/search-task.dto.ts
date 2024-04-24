import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Pagination } from 'src/common/dto/pagination.dto';

export class SearchTaskDto extends Pagination {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  readonly title: string;
}
