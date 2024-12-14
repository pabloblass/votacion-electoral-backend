import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El parámetro page debe ser un número entero' })
  @Min(1, { message: 'El parámetro page debe tener un valor mayor a cero' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El parámetro limit debe ser un número entero' })
  @Min(1, { message: 'El parámetro limit debe tener un valor mayor a cero' })
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'], {
    message: 'El parámetro sortOrder debe ser ASC o DESC',
  })
  sortOrder?: 'ASC' | 'DESC';
}
