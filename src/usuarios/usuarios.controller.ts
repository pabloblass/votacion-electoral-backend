import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Query,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PaginationDto } from 'src/compartido';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FilterUsuariosDto } from './dto/filter-usuarios.dto';
import { parseId } from 'src/compartido/validators/parse-id.validator';
import { UsuariosService } from './usuarios.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('update_password')
  updatePassword(
    //@Param('id') id: string,
    @Req() request: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    //const parsedId = parseId(id);
    const usuarioId = request.usuario.id;
    return this.usuariosService.updatePassword(usuarioId, updatePasswordDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUsuarioDto) {
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
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    const parsedId = parseId(id);
    return this.usuariosService.update(parsedId, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const parsedId = parseId(id);
    return this.usuariosService.remove(parsedId);
  }
}
