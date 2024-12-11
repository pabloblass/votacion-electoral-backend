import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { DepartamentosService } from './departamentos.service';
import { PaginationDto } from '../compartido';
import { FilterDptosDto } from './dto/filter-departamentos.dto';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { ParseIdPipe } from '../compartido/pipes/parse-id.pipe';

@Controller('departamentos')
export class DepartamentosController {
  constructor(private readonly departamentosService: DepartamentosService) {}

  @Post()
  create(
    @Req() request: Request,
    @Body() createDepartamentoDto: CreateDepartamentoDto,
  ) {
    return this.departamentosService.create({
      usuario_creacion: request.user.username,
      usuario_modificacion: request.user.username,
      ...createDepartamentoDto,
    });
  }

  @Get('list')
  findAll() {
    return this.departamentosService.findAll();
  }

  @Get()
  findPaginated(
    @Query() paginationDto: PaginationDto,
    @Query() filterDptosDto: FilterDptosDto,
  ) {
    return this.departamentosService.findPaginated(
      paginationDto,
      filterDptosDto,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.departamentosService.findOne(+id);
  }

  @Put(':id')
  update(
    @Req() request: Request,
    @Param('id', ParseIdPipe) id: number,
    @Body() updateDepartamentoDto: UpdateDepartamentoDto,
  ) {
    return this.departamentosService.update(id, {
      usuario_modificacion: request.user.username,
      ...updateDepartamentoDto,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.departamentosService.remove(+id);
  }
}
