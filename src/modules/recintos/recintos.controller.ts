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
import { RecintosService } from './recintos.service';
import { PaginationDto } from '../compartido';
import { FilterRecintosDto } from './dto/filter-recintos.dto';
import { CreateRecintoDto } from './dto/create-recinto.dto';
import { UpdateRecintoDto } from './dto/update-recinto.dto';
import { ParseIdPipe } from '../compartido/pipes/parse-id.pipe';

@Controller('recintos')
export class RecintosController {
  constructor(private readonly recintosService: RecintosService) {}

  @Post()
  create(@Req() request: Request, @Body() createRecintoDto: CreateRecintoDto) {
    return this.recintosService.create({
      usuario_creacion: request.user.username,
      usuario_modificacion: request.user.username,
      ...createRecintoDto,
    });
  }

  @Get('list')
  findByMunicipio(@Query('id_municipio', ParseIdPipe) idMunicipio: number) {
    return this.recintosService.findByMunicipio(idMunicipio);
  }

  @Get('municipio/:id')
  findRecintoByIdMunicipio(@Param('id', ParseIdPipe) id: number) {
    return this.recintosService.findRecintoByIdMunicipio(id);
  }

  @Get()
  findPaginated(
    @Query() paginationDto: PaginationDto,
    @Query() filterRecintosDto: FilterRecintosDto,
  ) {
    return this.recintosService.findPaginated(paginationDto, filterRecintosDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.recintosService.findOne(id);
  }

  @Put(':id')
  update(
    @Req() request: Request,
    @Param('id', ParseIdPipe) id: number,
    @Body() updateRecintoDto: UpdateRecintoDto,
  ) {
    return this.recintosService.update(id, {
      usuario_modificacion: request.user.username,
      ...updateRecintoDto,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.recintosService.remove(id);
  }
}
