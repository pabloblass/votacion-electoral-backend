import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { MunicipiosService } from './municipios.service';
import { ParseIdPipe } from '../compartido/pipes/parse-id.pipe';
import { PaginationDto } from '../compartido';
import { FilterMunicipiosDto } from './dto/filter-municipios.dto';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';

@Controller('municipios')
export class MunicipiosController {
  constructor(private readonly municipiosService: MunicipiosService) {}

  @Post()
  create(@Body() createMunicipioDto: CreateMunicipioDto) {
    return this.municipiosService.create(createMunicipioDto);
  }

  @Get('list')
  findByDpto(@Query('id_departamento', ParseIdPipe) idDepartamento: number) {
    return this.municipiosService.findByDpto(idDepartamento);
  }

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
    @Param('id', ParseIdPipe) id: number,
    @Body() updateMunicipioDto: UpdateMunicipioDto,
  ) {
    return this.municipiosService.update(id, updateMunicipioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.municipiosService.remove(id);
  }
}
