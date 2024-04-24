import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Pagination } from 'src/common/dto/pagination.dto';

export class SearchUsersDto extends Pagination {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    return value.trim();
  })
  searchBy: string;
}
