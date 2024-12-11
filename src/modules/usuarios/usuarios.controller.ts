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
import { ParseIdPipe } from '../compartido/pipes/parse-id.pipe';
import { PaginationDto } from 'src/modules/compartido';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FilterUsuariosDto } from './dto/filter-usuarios.dto';
import { UsuariosService } from './usuarios.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

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
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIdPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.usuariosService.remove(id);
  }

  @Post('update_password')
  updatePassword(
    @Req() request: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = request.usuario.id;
    return this.usuariosService.updatePassword(userId, updatePasswordDto);
  }
}