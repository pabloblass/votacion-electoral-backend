import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class FilterRecintosDto {
  /*@IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'El ID de Departamento debe ser positivo' })
  id_departamento?: number;*/

  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'El ID de Municipio debe ser positivo' })
  id_municipio?: number;

  @IsOptional()
  @IsString()
  distrito?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
