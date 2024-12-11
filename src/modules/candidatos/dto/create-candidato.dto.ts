import { Genero } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCandidatoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre: string;

  @IsNotEmpty()
  @IsEnum(Genero)
  genero: Genero;

  usuario_creacion: string;
  usuario_modificacion: string;
}
