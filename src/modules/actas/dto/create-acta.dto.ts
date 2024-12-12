import { Estado } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { VotoDTO } from './voto.dto';

export class CreateActaDto {
  @IsNotEmpty({ message: 'El ID de Mesa es obligatorio' })
  @Type(() => Number)
  @IsPositive({ message: 'El ID de Mesa debe ser positivo' })
  id_mesa: number;

  @IsNotEmpty({ message: 'La ruta de la imagen es obligatorio' })
  @MaxLength(250, {
    message: 'La ruta de la imagen no debe exceder los 250 caracteres',
  })
  imagen: string;

  @IsNotEmpty({ message: 'El campo votos válidos mujeres es obligatorio' })
  @Type(() => Number)
  @IsPositive({
    message: 'El campo votos válidos mujeres debe ser positivo',
  })
  validos_m: number;

  @IsNotEmpty({ message: 'El campo votos blancos mujeres es obligatorio' })
  @Type(() => Number)
  @IsPositive({ message: 'El campo votos blancos mujeres debe ser positivo' })
  blancos_m: number;

  @IsNotEmpty({ message: 'El campo votos nulos mujeres es obligatorio' })
  @Type(() => Number)
  @IsPositive({ message: 'El campo votos nulos mujeres debe ser positivo' })
  nulos_m: number;

  @IsNotEmpty({ message: 'El campo votos validos hombres es obligatorio' })
  @Type(() => Number)
  @IsPositive({ message: 'El campo votos validos hombres debe ser positivo' })
  validos_h: number;

  @IsNotEmpty({ message: 'El campo votos blancos hombres es obligatorio' })
  @Type(() => Number)
  @IsPositive({ message: 'El campo votos blancos hombres debe ser positivo' })
  blancos_h: number;

  @IsNotEmpty({ message: 'El campo votos nulos hombres es obligatorio' })
  @Type(() => Number)
  @IsPositive({ message: 'El campo votos nulos hombres debe ser positivo' })
  nulos_h: number;

  @IsArray({ message: 'El campo votos debe ser un array' })
  @ValidateNested({ each: true })
  votos: VotoDTO[];

  @IsNotEmpty({ message: 'El campo observado es obligatorio' })
  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'El campo observado debe ser un boleano' })
  observado: boolean;

  @IsOptional()
  @IsEnum(Estado)
  estado: Estado = Estado.PENDIENTE;

  usuario_creacion: string;
  usuario_modificacion: string;
}
