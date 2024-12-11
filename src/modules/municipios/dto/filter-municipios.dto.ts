import { IsOptional, IsString } from 'class-validator';

export class FilterMunicipiosDto {
  @IsOptional()
  @IsString()
  searchText?: string;
}
