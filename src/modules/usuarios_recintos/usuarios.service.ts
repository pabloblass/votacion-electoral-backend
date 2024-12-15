import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Rol } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

import { CreateUsuarioRecintoDto } from './dto/create-usuario-recinto.dto';
import { UpdateUsuarioRecintoDto } from './dto/update-usuario-recinto.dto';

@Injectable()
export class UsuariosRecintoService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectQuery: Prisma.UsuarioRecintoSelect = {
    id_usuario: true,
    id_recinto: true,
  };

  async create(createUsuarioRecintoDto: CreateUsuarioRecintoDto) {
    return this.prisma.usuarioRecinto.create({
      data: createUsuarioRecintoDto,
      select: this.selectQuery,
    });
  }
}
