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
import { MesasService } from './mesas.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { ParseIdPipe } from '../compartido/pipes/parse-id.pipe';
import { PaginationDto } from '../compartido';
import { FilterMesasDto } from './dto/filter-mesas.dto';

@Controller('mesas')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Post()
  create(@Req() request: Request, @Body() createMesaDto: CreateMesaDto) {
    return this.mesasService.create({
      usuario_creacion: request.user.username,
      usuario_modificacion: request.user.username,
      ...createMesaDto,
    });
  }

  @Get('list')
  findByRecinto(@Query('id_recinto', ParseIdPipe) idRecinto: number) {
    return this.mesasService.findByRecinto(idRecinto);
  }

  @Get()
  findPaginated(
    @Query() paginationDto: PaginationDto,
    @Query() filterMesasDto: FilterMesasDto,
  ) {
    return this.mesasService.findPaginated(paginationDto, filterMesasDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.mesasService.findOne(id);
  }

  @Get('recinto/:id')
  findMesaByIdRecinto(@Param('id', ParseIdPipe) id: number) {
    return this.mesasService.findMesaByIdRecinto(id);
  }

  @Put(':id')
  update(
    @Req() request: Request,
    @Param('id', ParseIdPipe) id: number,
    @Body() updateMesaDto: UpdateMesaDto,
  ) {
    return this.mesasService.update(id, {
      usuario_modificacion: request.user.username,
      ...updateMesaDto,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.mesasService.remove(id);
  }
}
