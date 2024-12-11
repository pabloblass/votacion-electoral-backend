import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { PaginationDto } from 'src/compartido';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FilterUsuariosDto } from './dto/filter-usuarios.dto';
import { parseId } from 'src/compartido/validators/parse-id.validator';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async create(@Body() createUserDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUserDto);
  }

  @Get()
  findPaginated(
    @Query() paginationDto: PaginationDto,
    @Query() filterUsersDto: FilterUsuariosDto,
  ) {
    return this.usuariosService.findPaginated(paginationDto, filterUsersDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const parsedId = parseId(id);
    return this.usuariosService.findOne(parsedId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const parsedId = parseId(id);
    return this.usuariosService.update(parsedId, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const parsedId = parseId(id);
    return this.usuariosService.remove(parsedId);
  }
}
