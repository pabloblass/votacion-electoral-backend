import { Genero } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCandidatoDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(150, {
    message: 'El nombre no debe exceder los 150 caracteres',
  })
  nombre: string;

  @IsNotEmpty({ message: 'El genero es obligatorio' })
  @IsEnum(Genero, {
    message: `El genero debe ser uno de los siguientes valores: ${Object.values(Genero).join(', ')}`,
  })
  genero: Genero;

  usuario_creacion: string;
  usuario_modificacion: string;
}
