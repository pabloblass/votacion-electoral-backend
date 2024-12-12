import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';

export class VotoDTO {
  @IsNotEmpty({ message: 'El ID del Candidato es obligatorio' })
  @Type(() => Number)
  @IsPositive({ message: 'El ID del Candidato debe ser positivo' })
  id_candidato: number;

  @IsNotEmpty({ message: 'El número de votos es obligatorio' })
  @Type(() => Number)
  @IsInt({ message: 'El número de votos debe ser un número entero' })
  @Min(0, { message: 'El número de votos debe ser mayor o igual a 0' })
  votos: number;

  usuario_creacion?: string;
  usuario_modificacion?: string;
}
