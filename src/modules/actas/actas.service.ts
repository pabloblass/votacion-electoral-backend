import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActaDto } from './dto/create-acta.dto';
import { UpdateActaDto } from './dto/update-acta.dto';
import { PaginationDto } from '../compartido';
import { FilterActasDto } from './dto/filter-actas.dto';

@Injectable()
export class ActasService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectQuery: Prisma.ActaSelect = {
    id: true,
    mesa: {
      select: {
        id: true,
        nro_mesa: true,
        recinto: {
          select: {
            id: true,
            descripcion: true,
            municipio: {
              select: {
                id: true,
                descripcion: true,
              },
            },
          },
        },
      },
    },
    imagen: true,
    validos_m: true,
    blancos_m: true,
    nulos_m: true,
    validos_h: true,
    blancos_h: true,
    nulos_h: true,
    observado: true,
    estado: true,
    activo: true,
    usuario_creacion: true,
    fecha_creacion: true,
    usuario_modificacion: true,
    fecha_modificacion: true,
  };

  async create(createActaDto: CreateActaDto) {
    const acta = await this.prisma.$transaction(async (tx) => {
      const { votos, usuario_creacion, usuario_modificacion, ...data } =
        createActaDto;

      const createdActa = await tx.acta.create({
        data: {
          ...data,
          ...(votos &&
            votos.length > 0 && {
              votos: {
                create: votos.map((voto) => ({
                  candidato: { connect: { id: voto.id_candidato } },
                  votos: voto.votos,
                  usuario_creacion,
                  usuario_modificacion,
                })),
              },
            }),
          usuario_creacion,
          usuario_modificacion,
        },
        select: this.selectQuery,
      });
      return createdActa;
    });

    return acta;
  }

  async findPaginated(
    paginationDto: PaginationDto,
    filterActasDto: FilterActasDto,
  ) {
    const { page = 1, limit = 10, sortBy, sortOrder } = paginationDto;
    const { id_municipio, id_recinto, nro_mesa } = filterActasDto;

    const where: Prisma.ActaWhereInput = {};

    if (id_municipio) {
      where.mesa = {
        recinto: {
          id_municipio: id_municipio,
        },
      };
    }

    if (id_recinto) {
      where.mesa = {
        id_recinto: id_recinto,
      };
    }

    if (nro_mesa) {
      where.mesa = {
        nro_mesa,
      };
    }

    const orderBy = sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() || 'asc' }
      : undefined;

    const [data, total] = await Promise.all([
      this.prisma.acta.findMany({
        where,
        select: {
          id: true,
          mesa: {
            select: {
              id: true,
              nro_mesa: true,
              recinto: {
                select: {
                  id: true,
                  descripcion: true,
                  municipio: {
                    select: {
                      id: true,
                      descripcion: true,
                    },
                  },
                },
              },
            },
          },
          observado: true,
          estado: true,
          activo: true,
        },
        skip: limit > 0 ? (page - 1) * limit : undefined,
        take: limit > 0 ? limit : undefined,
        orderBy,
      }),
      this.prisma.acta.count({ where }),
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

  async findOne(id: number) {
    const acta = await this.prisma.acta.findUnique({
      where: { id },
      select: this.selectQuery,
    });

    if (!acta) {
      throw new NotFoundException(`El acta con ID ${id} no existe`);
    }

    return acta;
  }

  async update(id: number, updateActaDto: UpdateActaDto) {
    const acta = await this.prisma.acta.findUnique({ where: { id } });

    if (!acta) {
      throw new NotFoundException(`El acta con ID ${id} no existe`);
    }

    const updatedActa = await this.prisma.$transaction(async (tx) => {
      const { imagen, votos, usuario_creacion, usuario_modificacion, ...data } =
        updateActaDto;

      const updatedActa = await tx.acta.update({
        where: { id },
        data: {
          ...data,
          ...(imagen && { imagen }), // Agregar imagen si está definida
          ...(votos &&
            votos.length > 0 && {
              votos: {
                upsert: votos.map((voto) => ({
                  where: { id_candidato: voto.id_candidato, id },
                  create: {
                    candidato: { connect: { id: voto.id_candidato } },
                    votos: voto.votos,
                    usuario_creacion,
                    usuario_modificacion,
                  },
                  update: {
                    votos: voto.votos,
                    usuario_modificacion,
                  },
                })),
              },
            }),
        },
        select: this.selectQuery,
      });

      return updatedActa;
    });

    return updatedActa;
  }

  async remove(id: number) {
    const acta = await this.prisma.acta.findUnique({ where: { id } });

    if (!acta) {
      throw new NotFoundException(`El acta con ID ${id} no existe`);
    }

    return this.prisma.acta.update({
      where: { id },
      data: {
        activo: false,
        fecha_eliminacion: new Date(),
        votos: {
          updateMany: {
            where: { id_acta: id },
            data: { activo: false, fecha_eliminacion: new Date() },
          },
        },
      },
      select: this.selectQuery,
    });
  }
}
