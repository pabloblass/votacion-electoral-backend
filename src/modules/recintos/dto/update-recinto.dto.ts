import { PartialType } from '@nestjs/mapped-types';
import { CreateRecintoDto } from './create-recinto.dto';

export class UpdateRecintoDto extends PartialType(CreateRecintoDto) {}
