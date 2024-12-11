import { IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateMunicipioDto {
  @IsNotEmpty({ message: 'La descripcion es obligatorio' })
  @IsString({ message: 'La descripcion debe ser una cadena de texto' })
  @MaxLength(250, {
    message: 'La descripcion no debe exceder los 250 caracteres',
  })
  descripcion: string;

  @IsNotEmpty({ message: 'El ID de Departamento es obligatorio' })
  @IsPositive({ message: 'El ID de Departamento debe ser positivo' })
  id_departamento: number;
}
