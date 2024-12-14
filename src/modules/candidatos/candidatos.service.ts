import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandidatoDto } from './dto/create-candidato.dto';
import { UpdateCandidatoDto } from './dto/update-candidato.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { FilterCandidatosDto } from './dto/filter-candidatos.dto';

@Injectable()
export class CandidatosService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectQuery: Prisma.CandidatoSelect = {
    id: true,
    nombre: true,
    genero: true,
    activo: true,
    usuario_creacion: true,
    fecha_creacion: true,
    usuario_modificacion: true,
    fecha_modificacion: true,
  };

  private async findCandidatoByIdOrThrow(id: number) {
    const candidato = await this.prisma.candidato.findUnique({
      where: { id },
      select: this.selectQuery,
    });

    if (!candidato) {
      throw new NotFoundException(`El candidato con ID ${id} no existe`);
    }

    return candidato;
  }

  create(createCandidatoDto: CreateCandidatoDto) {
    return this.prisma.candidato.create({
      data: createCandidatoDto,
      select: this.selectQuery,
    });
  }

  findAll() {
    return this.prisma.candidato.findMany({
      select: { id: true, nombre: true },
      where: { activo: true },
      orderBy: { genero: 'asc' },
    });
  }

  async findPaginated(
    paginationDto: PaginationDto,
    filterCandidatosDto: FilterCandidatosDto,
  ) {
    const { page = 1, limit = 10, sortBy, sortOrder } = paginationDto;
    const { searchText } = filterCandidatosDto;

    const where: Prisma.CandidatoWhereInput = searchText
      ? { nombre: { contains: searchText, mode: 'insensitive' } }
      : {};

    const orderBy = sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() || 'asc' }
      : undefined;

    const [data, total] = await Promise.all([
      this.prisma.candidato.findMany({
        where,
        select: { id: true, nombre: true, genero: true, activo: true },
        skip: limit > 0 ? (page - 1) * limit : undefined,
        take: limit > 0 ? limit : undefined,
        orderBy,
      }),
      this.prisma.candidato.count({ where }),
    ]);

    return {
      meta: {
        total,
        page,
        limit: limit > 0 ? limit : total,
        totalPage: limit > 0 ? Math.ceil(total / limit) : 1,
      },
      data,
    };
  }

  findOne(id: number) {
    return this.findCandidatoByIdOrThrow(id);
  }

  async update(id: number, updateCandidatoDto: UpdateCandidatoDto) {
    await this.findCandidatoByIdOrThrow(id);

    return this.prisma.candidato.update({
      where: { id },
      data: updateCandidatoDto,
      select: this.selectQuery,
    });
  }

  async remove(id: number) {
    await this.findCandidatoByIdOrThrow(id);

    return this.prisma.candidato.update({
      where: { id },
      data: {
        activo: false,
        fecha_eliminacion: new Date(),
      },
      select: this.selectQuery,
    });
  }
}
