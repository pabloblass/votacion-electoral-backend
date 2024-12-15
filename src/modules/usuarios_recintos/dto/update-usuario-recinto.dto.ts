import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioRecintoDto } from './create-usuario-recinto.dto';

export class UpdateUsuarioRecintoDto extends PartialType(CreateUsuarioRecintoDto) {}
