import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { CurrencyEnum } from 'src/common/enums/currency.enum';
import { AssignableRoleEnum } from '../enum/AssignableRoleEnum';

export class AddUserDto {
  @IsNotEmpty()
  @IsEnum(CurrencyEnum)
  readonly currency: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  readonly price: number;

  @IsNotEmpty()
  @IsEnum(AssignableRoleEnum)
  readonly assignedRole: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  readonly assignedTo: string;
}
