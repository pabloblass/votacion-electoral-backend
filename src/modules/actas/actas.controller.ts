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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import * as fs from 'fs/promises';
import { readdirSync } from 'fs';
import * as path from 'path';
import { ActasService } from './actas.service';
import { CreateActaDto } from './dto/create-acta.dto';
import { UpdateActaDto } from './dto/update-acta.dto';
import { PaginationDto } from '../compartido';
import { ParseIdPipe } from '../compartido/pipes/parse-id.pipe';
import { FilterActasDto } from './dto/filter-actas.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { multerConfig } from 'src/multer/multer.config';
import { FormDataToJsonInterceptor } from 'src/interceptors/form-data-to-json.interceptor';

@Controller('actas')
export class ActasController {
  constructor(private readonly actasService: ActasService) {}

  @Post()
  @UseInterceptors(
    FormDataToJsonInterceptor, // Aplica el transformador de datos
    FileInterceptor('imagen', multerConfig), // Maneja la carga del archivo
  )
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createActaDto: CreateActaDto,
    @Req() request: Request,
  ) {

    const exists = await this.actasService.existsIdMesa(createActaDto.id_mesa);

    if (!exists) {
      throw new BadRequestException('La Mesa ya tiene un Acta registrado');
    }
    // ver para transcriptores
    // if (!image) {
    //   throw new BadRequestException('Se debe cargar una imagen.');
    // }

    const defaultImagePath = 'src/uploads/defecto/defecto.jpg';
    return this.actasService.create({
      ...createActaDto,
      imagen: image?.filename || defaultImagePath,
      usuario_creacion: request.user.username,
      usuario_modificacion: request.user.username,
    });
  }

  @Get()
  findPaginated(
    @Query() paginationDto: PaginationDto,
    @Query() filterActasDto: FilterActasDto,
  ) {
    return this.actasService.findPaginated(paginationDto, filterActasDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.actasService.findOne(id);
  }

  @Get('registradas')
  findRegistradas() {
    return this.actasService.findRegistradas();
  }

  @Put(':id')
  @UseInterceptors(
    FormDataToJsonInterceptor,
    FileInterceptor('imagen', multerConfig),
  )
  async update(
    @Param('id', ParseIdPipe) id: number,
    @Body() updateActaDto: UpdateActaDto,
    @Req() request: Request,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const exists = await this.actasService.existsIdMesa(
      updateActaDto.id_mesa,
      id,
    );

    if (!exists) {
      throw new BadRequestException('La Mesa ya tiene un Acta registrado');
    }

    const actaOld = await this.actasService.findOne(id);

    let newImage: string | null = null;

    if (image) {
      newImage = image.filename;

      // Leer ruta base de imágenes desde una variable de entorno
      const imageBasePath =
        process.env.ROOT_PATH_IMAGES || path.join(process.cwd(), 'uploads');

      // Eliminar la imagen antigua si existe
      if (actaOld.imagen) {
        const oldImagePath = path.join(imageBasePath, actaOld.imagen);

        await fs.unlink(oldImagePath);
      }
    }

    const updatedActa = await this.actasService.update(id, {
      ...updateActaDto,
      imagen: newImage,
      usuario_creacion: request.user.username,
      usuario_modificacion: request.user.username,
    });

    return updatedActa;
  }

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.actasService.remove(id);
  }
}
