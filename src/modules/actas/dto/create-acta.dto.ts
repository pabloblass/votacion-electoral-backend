import { Estado } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { VotoDTO } from './voto.dto';

export class CreateActaDto {
  @IsNotEmpty({ message: 'La Mesa es obligatorio' })
  @Type(() => Number)
  @IsPositive({ message: 'El ID de Mesa debe ser positivo' })
  /*@IsUnique('Acta', 'id_mesa', {
    message: 'La Mesa ya tiene un Acta registrada',
  })*/
  id_mesa: number;


  /*@IsNotEmpty({ message: 'La imagen es obligatorio' })
  @MaxLength(250, {
    message: 'La ruta de la imagen no debe exceder los 250 caracteres',
  })*/
  imagen: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'El número de votos válidos mujeres debe ser un número entero',
  })
  @Min(0, {
    message: 'El número de votos válidos mujeres debe ser mayor o igual a 0',
  })
  validos_m?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'El número de votos blancos mujeres debe ser un número entero',
  })
  @Min(0, {
    message: 'El número de votos blancos mujeres debe ser mayor o igual a 0',
  })
  blancos_m?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'El número de votos nulos mujeres debe ser un número entero',
  })
  @Min(0, {
    message: 'El número de votos nulos mujeres debe ser mayor o igual a 0',
  })
  nulos_m?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'El número de votos validos hombres debe ser un número entero',
  })
  @Min(0, {
    message: 'El número de votos validos hombres debe ser mayor o igual a 0',
  })
  validos_h?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'El número de votos blancos hombres debe ser un número entero',
  })
  @Min(0, {
    message: 'El número de votos blancos hombres debe ser mayor o igual a 0',
  })
  blancos_h?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'El número de votos nulos hombres debe ser un número entero',
  })
  @Min(0, {
    message: 'El número de votos nulos hombres debe ser mayor o igual a 0',
  })
  nulos_h?: number;

  @IsOptional()
  @IsArray({ message: 'El campo votos debe ser un array' })
  @ValidateNested({ each: true })
  @Type(() => VotoDTO)
  votos?: VotoDTO[];

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
