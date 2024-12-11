import { IsOptional, IsString } from 'class-validator';

export class FilterCandidatosDto {
  @IsOptional()
  @IsString()
  searchText?: string;
}
