import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { MunicipiosService } from './municipios.service';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { FilterMunicipiosDto } from './dto/filter-municipios.dto';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';

@Controller('municipios')
export class MunicipiosController {
  constructor(private readonly municipiosService: MunicipiosService) {}

  @Post()
  create(
    @Req() request: Request,
    @Body() createMunicipioDto: CreateMunicipioDto,
  ) {
    return this.municipiosService.create({
      usuario_creacion: request.user.username,
      usuario_modificacion: request.user.username,
      ...createMunicipioDto,
    });
  }

  @Get('list')
  findAll() {
    return this.municipiosService.findAll();
  }

  /*@Get('list')
  findByDpto(@Query('id_departamento', ParseIdPipe) idDepartamento: number) {
    return this.municipiosService.findByDpto(idDepartamento);
  }*/

  @Get()
  findPaginated(
    @Query() paginationDto: PaginationDto,
    @Query() filterMunicipiosDto: FilterMunicipiosDto,
  ) {
    return this.municipiosService.findPaginated(
      paginationDto,
      filterMunicipiosDto,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.municipiosService.findOne(id);
  }

  @Put(':id')
  update(
    @Req() request: Request,
    @Param('id', ParseIdPipe) id: number,
    @Body() updateMunicipioDto: UpdateMunicipioDto,
  ) {
    return this.municipiosService.update(id, {
      usuario_modificacion: request.user.username,
      ...updateMunicipioDto,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.municipiosService.remove(id);
  }
}
