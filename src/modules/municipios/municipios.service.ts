import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../compartido';
import { FilterMunicipiosDto } from './dto/filter-municipios.dto';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MunicipiosService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectQuery: Prisma.MunicipioSelect = {
    id: true,
    descripcion: true,
    activo: true,
    fecha_creacion: true,
    fecha_actualizacion: true,
  };

  private async findMunicipioByIdOrThrow(id: number) {
    const municipio = await this.prisma.municipio.findUnique({
      where: { id },
      select: this.selectQuery,
    });

    if (!municipio) {
      throw new NotFoundException(`El municipio con ID ${id} no existe`);
    }

    return municipio;
  }

  create(createMunicipioDto: CreateMunicipioDto) {
    return this.prisma.municipio.create({
      data: createMunicipioDto,
      select: this.selectQuery,
    });
  }

  findByDpto(idDepartamento: number) {
    return this.prisma.municipio.findMany({
      select: { id: true, descripcion: true },
      where: { activo: true, id_departamento: idDepartamento },
      orderBy: { descripcion: 'asc' },
    });
  }

  async findPaginated(
    paginationDto: PaginationDto,
    filterMunicipiosDto: FilterMunicipiosDto,
  ) {
    const { page = 1, limit = 10, sortBy, sortOrder } = paginationDto;
    const { searchText } = filterMunicipiosDto;

    const where: Prisma.MunicipioWhereInput = searchText
      ? { descripcion: { contains: searchText, mode: 'insensitive' } }
      : {};

    const orderBy = sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() || 'asc' }
      : undefined;

    const [data, total] = await Promise.all([
      this.prisma.municipio.findMany({
        where,
        select: { id: true, descripcion: true, activo: true },
        skip: limit > 0 ? (page - 1) * limit : undefined,
        take: limit > 0 ? limit : undefined,
        orderBy,
      }),
      this.prisma.municipio.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit: limit > 0 ? limit : total,
        totalPage: limit > 0 ? Math.ceil(total / limit) : 1,
      },
    };
  }

  async findOne(id: number) {
    return this.findMunicipioByIdOrThrow(id);
  }

  async update(id: number, updateMunicipioDto: UpdateMunicipioDto) {
    await this.findMunicipioByIdOrThrow(id);

    return this.prisma.municipio.update({
      where: { id },
      data: updateMunicipioDto,
      select: this.selectQuery,
    });
  }

  async remove(id: number) {
    await this.findMunicipioByIdOrThrow(id);

    return this.prisma.municipio.update({
      where: { id },
      data: {
        activo: false,
      },
      select: this.selectQuery,
    });
  }
}
