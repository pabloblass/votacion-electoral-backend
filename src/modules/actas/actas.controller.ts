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
import * as fs from 'fs/promises';
import * as path from 'path';
import { Request } from 'express';
import { ActasService } from './actas.service';
import { DashboardGateway } from '../dashboard/dashboard.gateway';
import { FormDataToJsonInterceptor } from 'src/common/interceptors/form-data-to-json.interceptor';
import { CreateActaDto } from './dto/create-acta.dto';
import { UpdateActaDto } from './dto/update-acta.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { FilterActasDto } from './dto/filter-actas.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { multerConfig } from 'src/config/multer.config';

@Controller('actas')
export class ActasController {
  constructor(
    private readonly actasService: ActasService,
    private readonly dashboardGateway: DashboardGateway,
  ) {}

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

    if (!image) {
      throw new BadRequestException('Se debe cargar una imagen.');
    }

    const defaultImagePath = 'src/uploads/defecto/defecto.jpg';
    const createdActa = this.actasService.create({
      ...createActaDto,
      imagen: image?.filename || defaultImagePath,
      usuario_creacion: request.user.username,
      usuario_modificacion: request.user.username,
    });

    // Notificar al dashboard despues de crear el acta
    const votosPorCandidatos =
      await this.dashboardGateway.dashboardService.getVotosPorCandidatos();
    const votosPorMunicipiosYCandidatos =
      await this.dashboardGateway.dashboardService.getVotosPorMunicipiosYCandidatos();

    // Emitir eventos para actualizar el dashboard
    this.dashboardGateway.emitUpdateVotosPorCandidatos(votosPorCandidatos);
    this.dashboardGateway.emitUpdateVotosPorMunicipiosYCandidatos(
      votosPorMunicipiosYCandidatos,
    );

    return createdActa;
  }

  @Get()
  findPaginated(
    @Query() paginationDto: PaginationDto,
    @Query() filterActasDto: FilterActasDto,
  ) {
    return this.actasService.findPaginated(paginationDto, filterActasDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIdPipe) id: number) {
    const actaFound = await this.actasService.findOne(id);

    if (actaFound.imagen) {
      const folderPath = process.env.ROOT_PATH_IMAGES || './uploads';
      const imagePath = path.join(folderPath, actaFound.imagen);

      try {
        // Lee el archivo en base64
        const imageBuffer = await fs.readFile(imagePath);
        actaFound.imagen = imageBuffer.toString('base64');
      } catch {
        actaFound.imagen = null;
      }
    }

    return actaFound;
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

      // Leer ruta base de imagenes desde una variable de entorno
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

    // Notificar al dashboard despues de crear el acta
    const votosPorCandidatos =
      await this.dashboardGateway.dashboardService.getVotosPorCandidatos();
    const votosPorMunicipiosYCandidatos =
      await this.dashboardGateway.dashboardService.getVotosPorMunicipiosYCandidatos();

    // Emitir eventos para actualizar el dashboard
    this.dashboardGateway.emitUpdateVotosPorCandidatos(votosPorCandidatos);
    this.dashboardGateway.emitUpdateVotosPorMunicipiosYCandidatos(
      votosPorMunicipiosYCandidatos,
    );

    return updatedActa;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIdPipe) id: number) {
    await this.actasService.remove(id);

    // Notificar al dashboard despues de crear el acta
    const votosPorCandidatos =
      await this.dashboardGateway.dashboardService.getVotosPorCandidatos();
    const votosPorMunicipiosYCandidatos =
      await this.dashboardGateway.dashboardService.getVotosPorMunicipiosYCandidatos();

    // Emitir eventos para actualizar el dashboard
    this.dashboardGateway.emitUpdateVotosPorCandidatos(votosPorCandidatos);
    this.dashboardGateway.emitUpdateVotosPorMunicipiosYCandidatos(
      votosPorMunicipiosYCandidatos,
    );

    return { message: 'Acta eliminada correctamente' };
  }
}
