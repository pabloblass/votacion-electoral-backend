import { IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateRecintoDto {
  @IsNotEmpty({ message: 'La descripcion es obligatorio' })
  @IsString({ message: 'La descripcion debe ser una cadena de texto' })
  @MaxLength(250, {
    message: 'La descripcion no debe exceder los 250 caracteres',
  })
  descripcion: string;

  @IsNotEmpty({ message: 'El ID de Municipio es obligatorio' })
  @IsPositive({ message: 'El ID de Municipio debe ser positivo' })
  id_municipio: number;

  usuario_creacion: string;
  usuario_modificacion: string;
}
