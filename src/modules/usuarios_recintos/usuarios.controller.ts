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
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateUsuarioRecintoDto } from './dto/create-usuario-recinto.dto';
import { UpdateUsuarioRecintoDto } from './dto/update-usuario-recinto.dto';
import { UsuariosRecintoService } from './usuarios.service';

@Controller('usuarios-recintos')
export class UsuariosRecintoController {
  constructor(
    private readonly usuariosRecintoService: UsuariosRecintoService,
  ) {}

  @Post()
  create(
    @Req() request: Request,
    @Body() createUserRecintoDto: CreateUsuarioRecintoDto,
  ) {
    return this.usuariosRecintoService.create(createUserRecintoDto);
  }
}
