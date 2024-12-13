import { Estado } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  //MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { VotoDTO } from './voto.dto';
import { IsUnique } from 'src/decorators/is-unique.decorator';

export class CreateActaDto {
  @IsNotEmpty({ message: 'El ID de Mesa es obligatorio' })
  @Type(() => Number)
  @IsPositive({ message: 'El ID de Mesa debe ser positivo' })
  //@IsUniqueIdMesa({ message: 'La Mesa ya tiene acta registrada' })
  @IsUnique('Mesa', 'id_mesa', 0, { message: 'El ID de Mesa debe ser único' })
  id_mesa: number;

  /*@IsNotEmpty({ message: 'La imagen es obligatorio' })
  @MaxLength(250, {
    message: 'La ruta de la imagen no debe exceder los 250 caracteres',
  })*/
  imagen: string;

  //@IsNotEmpty({ message: 'El campo votos válidos mujeres es obligatorio' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'El campo votos válidos mujeres debe ser un número entero',
  })
  @Min(0, {
    message: 'El campo votos válidos mujeres debe ser mayor o igual a 0',
  })
  validos_m?: number;

  //@IsNotEmpty({ message: 'El campo votos blancos mujeres es obligatorio' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'El campo votos blancos mujeres debe ser un número entero',
  })
  @Min(0, {
    message: 'El campo votos blancos mujeres debe ser mayor o igual a 0',
  })
  blancos_m?: number;

  //@IsNotEmpty({ message: 'El campo votos nulos mujeres es obligatorio' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'El campo votos nulos mujeres debe ser un número entero',
  })
  @Min(0, {
    message: 'El campo votos nulos mujeres debe ser mayor o igual a 0',
  })
  nulos_m?: number;

  //@IsNotEmpty({ message: 'El campo votos validos hombres es obligatorio' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'El campo votos validos hombres debe ser un número entero',
  })
  @Min(0, {
    message: 'El campo votos validos hombres debe ser mayor o igual a 0',
  })
  validos_h?: number;

  //@IsNotEmpty({ message: 'El campo votos blancos hombres es obligatorio' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'El campo votos blancos hombres debe ser un número entero',
  })
  @Min(0, {
    message: 'El campo votos blancos hombres debe ser mayor o igual a 0',
  })
  blancos_h?: number;

  //@IsNotEmpty({ message: 'El campo votos nulos hombres es obligatorio' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'El campo votos nulos hombres debe ser un número entero',
  })
  @Min(0, {
    message: 'El campo votos nulos hombres debe ser mayor o igual a 0',
  })
  nulos_h?: number;

  @IsOptional()
  @IsArray({ message: 'El campo votos debe ser un array' })
  @ValidateNested({ each: true })
  @Type(() => VotoDTO)
  votos?: VotoDTO[];

  //@IsNotEmpty({ message: 'El campo observado es obligatorio' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'El campo observado debe ser un boleano' })
  observado?: boolean;

  @IsOptional()
  @IsEnum(Estado)
  estado: Estado = Estado.PENDIENTE;

  usuario_creacion: string;
  usuario_modificacion: string;
}
