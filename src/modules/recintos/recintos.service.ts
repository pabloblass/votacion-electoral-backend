import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecintoDto } from './dto/create-recinto.dto';
import { UpdateRecintoDto } from './dto/update-recinto.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { FilterRecintosDto } from './dto/filter-recintos.dto';

@Injectable()
export class RecintosService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectQuery: Prisma.RecintoSelect = {
    id: true,
    descripcion: true,
    municipio: {
      select: {
        id: true,
        descripcion: true,
        /*departamento: {
          select: {
            id: true,
            descripcion: true,
          },
        },*/
      },
    },
    distrito: true,
    activo: true,
    usuario_creacion: true,
    fecha_creacion: true,
    usuario_modificacion: true,
    fecha_modificacion: true,
  };

  private async findRecintoByIdOrThrow(id: number) {
    const recinto = await this.prisma.recinto.findUnique({
      where: { id },
      select: this.selectQuery,
    });

    if (!recinto) {
      throw new NotFoundException(`El recinto con ID ${id} no existe`);
    }

    return recinto;
  }

  create(createRecintoDto: CreateRecintoDto) {
    return this.prisma.recinto.create({
      data: createRecintoDto,
      select: this.selectQuery,
    });
  }

  findByMunicipio(idMunicipio: number) {
    return this.prisma.recinto.findMany({
      select: { id: true, descripcion: true },
      where: { activo: true, id_municipio: idMunicipio },
      orderBy: { descripcion: 'asc' },
    });
  }

  async findPaginated(
    paginationDto: PaginationDto,
    filterRecintosDto: FilterRecintosDto,
  ) {
    const { page = 1, limit = 10, sortBy, sortOrder } = paginationDto;
    const { id_municipio, distrito, descripcion } = filterRecintosDto;

    const where: Prisma.RecintoWhereInput = {};

    /*if (id_departamento) {
      where.municipio = {
        id_departamento: id_departamento,
      };
    }*/

    if (id_municipio) {
      where.id_municipio = id_municipio;
    }

    if (distrito) {
      where.distrito = { contains: distrito, mode: 'insensitive' };
    }

    if (descripcion) {
      where.descripcion = { contains: descripcion, mode: 'insensitive' };
    }

    const orderBy = sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() || 'asc' }
      : undefined;

    const [data, total] = await Promise.all([
      this.prisma.recinto.findMany({
        where,
        select: {
          id: true,
          descripcion: true,
          municipio: {
            select: {
              id: true,
              descripcion: true,
              /*departamento: {
                select: {
                  id: true,
                  descripcion: true,
                },
              },*/
            },
          },
          distrito: true,
          activo: true,
        },
        skip: limit > 0 ? (page - 1) * limit : undefined,
        take: limit > 0 ? limit : undefined,
        orderBy,
      }),
      this.prisma.recinto.count({ where }),
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
    return this.findRecintoByIdOrThrow(id);
  }

  async update(id: number, updateRecintoDto: UpdateRecintoDto) {
    await this.findRecintoByIdOrThrow(id);

    return this.prisma.recinto.update({
      where: { id },
      data: updateRecintoDto,
      select: this.selectQuery,
    });
  }

  findRecintoByIdMunicipio(idMunicipio: number) {
    return this.prisma.recinto.findMany({
      where: {
        id_municipio: idMunicipio,
      },
    });
  }

  async remove(id: number) {
    await this.findRecintoByIdOrThrow(id);

    return this.prisma.recinto.update({
      where: { id },
      data: {
        activo: false,
        fecha_eliminacion: new Date(),
      },
      select: this.selectQuery,
    });
  }
}
