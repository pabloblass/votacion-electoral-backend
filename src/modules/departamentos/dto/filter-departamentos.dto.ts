import { IsOptional, IsString } from 'class-validator';

export class FilterDptosDto {
  @IsOptional()
  @IsString()
  searchText?: string;
}
