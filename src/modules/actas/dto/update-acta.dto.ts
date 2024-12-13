import { PartialType } from '@nestjs/mapped-types';
import { CreateActaDto } from './create-acta.dto';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateActaDto extends PartialType(CreateActaDto) {
  /*@IsOptional()
  @Transform(({ obj }) => obj.id || undefined)
  id?: number;*/

  @IsNotEmpty({ message: 'La Mesa es obligatorio' })
  @Type(() => Number)
  @IsPositive({ message: 'El ID de Mesa debe ser positivo' })
  /*@IsUnique('Acta', 'id_mesa', {
    message: 'La Mesa ya tiene un Acta registrada',
  })*/
  id_mesa: number;

  imagen?: string;
}
