import { Tipo } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCandidatoDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(150, {
    message: 'El nombre no debe exceder los 150 caracteres',
  })
  nombre: string;

  @IsNotEmpty({ message: 'El tipo es obligatorio' })
  @IsEnum(Tipo, {
    message: `El genero debe ser uno de los siguientes valores: ${Object.values(Tipo).join(', ')}`,
  })
  tipo: Tipo;

  @IsNotEmpty({ message: 'El color es obligatorio' })
  @IsString({ message: 'El color debe ser un codigo hexadecimal' })
  @MaxLength(150, {
    message: 'El color no debe exceder los 30 caracteres',
  })
  color: string;

  usuario_creacion: string;
  usuario_modificacion: string;
}
