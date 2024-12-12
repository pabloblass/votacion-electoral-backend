import { IsNotEmpty, IsPositive, Min } from 'class-validator';

export class VotoDTO {
  @IsNotEmpty({ message: 'El ID del Candidato es obligatorio' })
  @IsPositive({ message: 'El ID del Candidato debe ser positivo' })
  id_candidato: number;

  @IsNotEmpty({ message: 'La cantidad de votos es obligatorio' })
  @Min(0, { message: 'La cantidad de votos debe ser mayor o igual a 0' })
  votos: number;

  usuario_creacion?: string;
  usuario_modificacion?: string;
}
