import { Rol } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre_apellido: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  username: string;

  @ValidateIf((o) => o.rol === Rol.ADMINISTRADOR)
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ValidateIf((o) => o.rol === Rol.ADMINISTRADOR)
  @IsOptional()
  @IsString()
  @MinLength(8)
  password_confirmation?: string;

  @IsNotEmpty()
  @IsEnum(Rol)
  rol: Rol;
}
