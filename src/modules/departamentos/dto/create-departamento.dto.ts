import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDepartamentoDto {
  @IsNotEmpty({ message: 'La descripcion es obligatorio' })
  @IsString({ message: 'La descripcion debe ser una cadena de texto' })
  @MaxLength(250, {
    message: 'La descripcion no debe exceder los 250 caracteres',
  })
  descripcion: string;
}
