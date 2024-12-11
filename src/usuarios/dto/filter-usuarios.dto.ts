import { IsOptional, IsString } from 'class-validator';

export class FilterUsuariosDto {
  @IsOptional()
  @IsString()
  searchText?: string;
}
