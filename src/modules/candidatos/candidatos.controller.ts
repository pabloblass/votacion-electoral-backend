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
import { CandidatosService } from './candidatos.service';
import { CreateCandidatoDto } from './dto/create-candidato.dto';
import { UpdateCandidatoDto } from './dto/update-candidato.dto';
import { FilterCandidatosDto } from './dto/filter-candidatos.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';

@Controller('candidatos')
export class CandidatosController {
  constructor(private readonly candidatosService: CandidatosService) {}

  @Post()
  create(
    @Req() request: Request,
    @Body() createCandidatoDto: CreateCandidatoDto,
  ) {
    return this.candidatosService.create({
      usuario_creacion: request.user.username,
      usuario_modificacion: request.user.username,
      ...createCandidatoDto,
    });
  }

  @Get('list')
  findAll() {
    return this.candidatosService.findAll();
  }

  @Get()
  findPaginated(
    @Query() paginationDto: PaginationDto,
    @Query() filterCandidatosDto: FilterCandidatosDto,
  ) {
    return this.candidatosService.findPaginated(
      paginationDto,
      filterCandidatosDto,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.candidatosService.findOne(+id);
  }

  @Put(':id')
  update(
    @Req() request: Request,
    @Param('id', ParseIdPipe) id: number,
    @Body() updateCandidatoDto: UpdateCandidatoDto,
  ) {
    return this.candidatosService.update(id, {
      usuario_modificacion: request.user.username,
      ...updateCandidatoDto,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.candidatosService.remove(id);
  }
}
