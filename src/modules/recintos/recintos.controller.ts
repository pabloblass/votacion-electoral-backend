import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
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
  create(@Body() createRecintoDto: CreateRecintoDto) {
    return this.recintosService.create(createRecintoDto);
  }

  @Get('list')
  findByMunicipio(@Query('id_municipio', ParseIdPipe) idMunicipio: number) {
    return this.recintosService.findByMunicipio(idMunicipio);
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

  @Patch(':id')
  update(
    @Param('id', ParseIdPipe) id: number,
    @Body() updateRecintoDto: UpdateRecintoDto,
  ) {
    return this.recintosService.update(id, updateRecintoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.recintosService.remove(id);
  }
}
