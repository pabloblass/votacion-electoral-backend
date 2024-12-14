import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { FilterDptosDto } from './dto/filter-departamentos.dto';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';

@Injectable()
export class DepartamentosService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectQuery: Prisma.DepartamentoSelect = {
    id: true,
    descripcion: true,
    activo: true,
    usuario_creacion: true,
    fecha_creacion: true,
    usuario_modificacion: true,
    fecha_modificacion: true,
  };

  private async findDepartamentoByIdOrThrow(id: number) {
    const departamento = await this.prisma.departamento.findUnique({
      where: { id },
      select: this.selectQuery,
    });

    if (!departamento) {
      throw new NotFoundException(`El departamento con ID ${id} no existe`);
    }

    return departamento;
  }

  create(createDptoDto: CreateDepartamentoDto) {
    return this.prisma.departamento.create({
      data: createDptoDto,
      select: this.selectQuery,
    });
  }

  findAll() {
    return this.prisma.departamento.findMany({
      select: { id: true, descripcion: true },
      where: { activo: true },
      //orderBy: { descripcion: 'asc' },
    });
  }

  async findPaginated(
    paginationDto: PaginationDto,
    filterDptosDto: FilterDptosDto,
  ) {
    const { page = 1, limit = 10, sortBy, sortOrder } = paginationDto;
    const { searchText } = filterDptosDto;

    const where: Prisma.DepartamentoWhereInput = searchText
      ? { descripcion: { contains: searchText, mode: 'insensitive' } }
      : {};

    const orderBy = sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() || 'asc' }
      : undefined;

    const [data, total] = await Promise.all([
      this.prisma.departamento.findMany({
        where,
        select: { id: true, descripcion: true, activo: true },
        skip: limit > 0 ? (page - 1) * limit : undefined,
        take: limit > 0 ? limit : undefined,
        orderBy,
      }),
      this.prisma.departamento.count({ where }),
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
    return this.findDepartamentoByIdOrThrow(id);
  }

  async update(id: number, updateDptoDto: UpdateDepartamentoDto) {
    await this.findDepartamentoByIdOrThrow(id);

    return this.prisma.departamento.update({
      where: { id },
      data: updateDptoDto,
      select: this.selectQuery,
    });
  }

  async remove(id: number) {
    await this.findDepartamentoByIdOrThrow(id);

    return this.prisma.departamento.update({
      where: { id },
      data: {
        activo: false,
        fecha_eliminacion: new Date(),
      },
      select: this.selectQuery,
    });
  }
}
