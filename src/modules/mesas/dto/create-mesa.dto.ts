import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateMesaDto {
  @IsNotEmpty({ message: 'El ID de Recinto es obligatorio' })
  @IsPositive({ message: 'El ID de Recinto debe ser positivo' })
  id_recinto: number;

  /*@IsNotEmpty({ message: 'El código es obligatorio' })
  @IsPositive({ message: 'El código debe ser positivo' })
  codigo: string;*/

  @IsNotEmpty({ message: 'El Número es obligatorio' })
  @IsPositive({ message: 'El Número debe ser positivo' })
  numero: number;

  @IsNotEmpty({ message: 'La Cantidad de Habilitados es obligatorio' })
  @IsPositive({ message: 'La Cantidad de Habilitados debe ser positivo' })
  habilitados: number;
}
