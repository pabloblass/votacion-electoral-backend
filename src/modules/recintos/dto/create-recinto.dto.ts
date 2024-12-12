import { Type } from 'class-transformer';
import { IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateRecintoDto {
  @IsNotEmpty({ message: 'El ID de Municipio es obligatorio' })
  @Type(() => Number)
  @IsPositive({ message: 'El ID de Municipio debe ser positivo' })
  id_municipio: number;

  @IsNotEmpty({ message: 'La descripcion es obligatorio' })
  @IsString({ message: 'La descripcion debe ser una cadena de texto' })
  @MaxLength(250, {
    message: 'La descripcion no debe exceder los 250 caracteres',
  })
  descripcion: string;

  @IsNotEmpty({ message: 'El distrito es obligatorio' })
  @IsString({ message: 'El distrito debe ser una cadena de texto' })
  @MaxLength(250, {
    message: 'El distrito no debe exceder los 250 caracteres',
  })
  distrito: string;

  usuario_creacion: string;
  usuario_modificacion: string;
}
