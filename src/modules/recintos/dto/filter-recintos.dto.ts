import { IsOptional, IsPositive, IsString } from 'class-validator';

export class FilterRecintosDto {
  @IsOptional()
  @IsPositive({ message: 'El ID de Departamento debe ser positivo' })
  id_departamento?: number;

  @IsOptional()
  @IsPositive({ message: 'El ID de Municipio debe ser positivo' })
  id_municipio?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
