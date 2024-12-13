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
  @IsNotEmpty({ message: 'El nombre y apellido es obligatorio' })
  @IsString({ message: 'El nombre y apellido debe ser una cadena de texto' })
  @MaxLength(150)
  nombre_apellido: string;

  @IsNotEmpty({ message: 'El username es obligatorio' })
  @IsString({ message: 'El username debe ser una cadena de texto' })
  @MaxLength(30)
  username: string;

  @IsNotEmpty({ message: 'El password es obligatorio' })
  //@ValidateIf((o) => o.rol === Rol.ADMINISTRADOR)
  //@IsOptional()
  @IsString({ message: 'El password debe ser una cadena de texto' })
  @MinLength(8)
  password?: string;

  @IsNotEmpty({ message: 'La confirmación del password es obligatorio' })
  //@ValidateIf((o) => o.rol === Rol.ADMINISTRADOR)
  //@IsOptional()
  @IsString({
    message: 'La confirmación del password debe ser una cadena de texto',
  })
  @MinLength(8)
  password_confirmation?: string;

  @IsNotEmpty({ message: 'El rol es obligatorio' })
  @IsEnum(Rol, {
    message: `El rol debe ser uno de los siguientes valores: ${Object.values(Rol).join(', ')}`,
  })
  rol: Rol;

  @ValidateIf((o) => o.rol === Rol.USUARIO_RECINTO)
  @IsOptional()
  @IsArray({ message: 'El campo recintos debe ser un array' })
  @IsPositive({
    each: true,
    message: 'Los valores del array recintos deben ser positivos',
  })
  recintos?: number[];

  usuario_creacion: string;
  usuario_modificacion: string;
}
