import { Rol } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUsuarioRecintoDto {

  @IsNotEmpty({ message: 'El ID de usuario es obligatorio' })
    @Type(() => Number)
    @IsPositive({ message: 'El ID de usuario debe ser positivo' })
    id_usuario: number;

  @IsNotEmpty({ message: 'El ID de Recinto es obligatorio' })
    @Type(() => Number)
    @IsPositive({ message: 'El ID de Recinto debe ser positivo' })
    id_recinto: number;
}
