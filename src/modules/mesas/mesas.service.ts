import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../compartido';
import { FilterMesasDto } from './dto/filter-mesas.dto';

@Injectable()
export class MesasService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectQuery: Prisma.MesaSelect = {
    id: true,
    nro_mesa: true,
    habilitados: true,
    recinto: {
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
      },
    },
    activo: true,
    usuario_creacion: true,
    fecha_creacion: true,
    usuario_modificacion: true,
    fecha_modificacion: true,
  };

  private async findMesaByIdOrThrow(id: number) {
    const mesa = await this.prisma.mesa.findUnique({
      where: { id },
      select: this.selectQuery,
    });

    if (!mesa) {
      throw new NotFoundException(`La mesa con ID ${id} no existe`);
    }

    return mesa;
  }

  create(createMesaDto: CreateMesaDto) {
    return this.prisma.mesa.create({
      data: createMesaDto,
      select: this.selectQuery,
    });
  }

  findByRecinto(idRecinto: number) {
    return this.prisma.mesa.findMany({
      select: { id: true, nro_mesa: true, habilitados: true },
      where: { activo: true, id_recinto: idRecinto },
      orderBy: { nro_mesa: 'asc' },
    });
  }

  async findPaginated(
    paginationDto: PaginationDto,
    filterMesasDto: FilterMesasDto,
  ) {
    const { page = 1, limit = 10, sortBy, sortOrder } = paginationDto;
    const { id_municipio, id_recinto, nro_mesa } = filterMesasDto;

    const where: Prisma.MesaWhereInput = {};

    /*if (id_departamento) {
      where.recinto = {
        municipio: {
          id_departamento: id_departamento,
        },
      };
    }*/

    if (id_municipio) {
      where.recinto = {
        id_municipio: id_municipio,
      };
    }

    if (id_recinto) {
      where.id_recinto = id_recinto;
    }

    if (nro_mesa) {
      where.nro_mesa = nro_mesa;
    }

    const orderBy = sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() || 'asc' }
      : undefined;

    const [data, total] = await Promise.all([
      this.prisma.mesa.findMany({
        where,
        select: {
          id: true,
          nro_mesa: true,
          habilitados: true,
          recinto: {
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
            },
          },
          activo: true,
        },
        skip: limit > 0 ? (page - 1) * limit : undefined,
        take: limit > 0 ? limit : undefined,
        orderBy,
      }),
      this.prisma.mesa.count({ where }),
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

  findMesaByIdRecinto(idRecinto: number) {
    return this.prisma.mesa.findMany({
      where: {
        id_recinto: idRecinto,
      },
    });
  }

  findOne(id: number) {
    return this.findMesaByIdOrThrow(id);
  }

  async update(id: number, updateMesaDto: UpdateMesaDto) {
    await this.findMesaByIdOrThrow(id);

    return this.prisma.mesa.update({
      where: { id },
      data: updateMesaDto,
      select: this.selectQuery,
    });
  }

  async remove(id: number) {
    await this.findMesaByIdOrThrow(id);

    return this.prisma.mesa.update({
      where: { id },
      data: {
        activo: false,
        fecha_eliminacion: new Date(),
      },
      select: this.selectQuery,
    });
  }
}
