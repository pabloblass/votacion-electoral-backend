import { IsOptional, IsPositive } from 'class-validator';

export class FilterActasDto {
  /*@IsOptional()
  @IsPositive({ message: 'El ID de Departamento debe ser positivo' })
  id_departamento?: number;*/

  @IsOptional()
  //@IsPositive({ message: 'El ID de Municipio debe ser positivo' })
  municipio?: string;

  @IsOptional()
  //@IsPositive({ message: 'El ID de Recinto debe ser positivo' })
  recinto?: string;

  @IsOptional()
  @IsPositive({ message: 'El Número de Mesa debe ser positivo' })
  nro_mesa?: number;
}
