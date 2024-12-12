import { Rol } from '@prisma/client';
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

  @ValidateIf((o) => o.rol === Rol.USUARIO_RECINTO)
  @IsOptional()
  @IsArray()
  @IsPositive({
    each: true,
    message: 'Los valores del array recintos deben ser positivos',
  })
  recintos?: number[];

  usuario_creacion: string;
  usuario_modificacion: string;
}
