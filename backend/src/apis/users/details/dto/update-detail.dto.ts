import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDetailDto {
  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsNotEmpty()
  @IsString()
  readonly mobile: string;

  @IsNotEmpty()
  @IsString()
  readonly nameOnPassbook: string;

  @IsNotEmpty()
  @IsString()
  readonly bankName: string;

  @IsNotEmpty()
  @IsString()
  readonly accountNumber: string;

  @IsNotEmpty()
  @IsString()
  readonly ifsc: string;

  @IsNotEmpty()
  @IsString()
  readonly panNum: string;
}
