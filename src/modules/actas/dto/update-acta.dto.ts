import { PartialType } from '@nestjs/mapped-types';
import { CreateActaDto } from './create-acta.dto';
import { IsOptional, MaxLength } from 'class-validator';

export class UpdateActaDto extends PartialType(CreateActaDto) {
  @IsOptional()
  @MaxLength(250, {
    message: 'La ruta de la imagen no debe exceder los 250 caracteres',
  })
  imagen?: string;
}
