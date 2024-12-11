import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PaginationDto } from 'src/compartido';
import { FilterUsuariosDto } from './dto/filter-usuarios.dto';
import { Prisma, Rol } from '@prisma/client';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectQuery: Prisma.UsuarioSelect = {
    id: true,
    nombre_apellido: true,
    username: true,
    rol: true,
    activo: true,
    fecha_creacion: true,
    fecha_actualizacion: true,
  };

  private async isExistUsername(
    username: string,
    excludeUserId?: number,
  ): Promise<boolean> {
    const user = await this.prisma.usuario.findUnique({
      where: { username },
    });
    // Si no se proporciona un id a excluir, se retorna true si el usuario ya existe
    if (!excludeUserId) {
      return !!user;
    }

    // Si se proporciona un id, se verifica que el usuario encontrado no tenga ese id
    return !!user && user.id !== excludeUserId;
  }

  async findByUsername(username: string) {
    return this.prisma.usuario.findFirst({
      where: {
        username,
        activo: true,
      },
      select: {
        id: true,
        nombre_apellido: true,
        username: true,
        password: true,
        rol: true,
      },
    });
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { password, password_confirmation, rol } = createUsuarioDto;

    // Validar si el username ya está registrado
    const usernameTaken = await this.isExistUsername(createUsuarioDto.username);
    if (usernameTaken) {
      throw new BadRequestException('El username ya está registrado.');
    }

    // Si el rol es ADMINISTRADOR, se debe verificar la contraseña
    if (rol === 'ADMINISTRADOR' && password) {
      if (!password_confirmation || password !== password_confirmation) {
        throw new BadRequestException(
          'Las contraseñas no coinciden o están vacías',
        );
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el objeto usuario con la contraseña encriptada
      const userData = { ...createUsuarioDto, password: hashedPassword };

      // Excluir password_confirmation antes de guardar en BD
      delete userData.password_confirmation;

      return this.prisma.usuario.create({
        data: userData,
        select: this.selectQuery,
      });
    }

    // Si no es ADMINISTRADOR, no es necesario encriptar la contraseña
    // Excluir password_confirmation antes de guardar en BD
    delete createUsuarioDto.password_confirmation;
    return this.prisma.usuario.create({
      data: createUsuarioDto,
      select: this.selectQuery,
    });
  }

  async findPaginated(
    paginationDto: PaginationDto,
    filterUsersDto: FilterUsuariosDto,
  ) {
    const { page = 1, limit = 10, sortBy, sortOrder } = paginationDto;
    const { searchText } = filterUsersDto;

    // Filtrar roles válidos que contengan el texto de búsqueda
    const rolesMatchingSearch = searchText
      ? Object.values(Rol).filter((rol) =>
          rol.toLowerCase().includes(searchText.toLowerCase()),
        )
      : [];

    const where: Prisma.UsuarioWhereInput = searchText
      ? {
          OR: [
            { nombre_apellido: { contains: searchText, mode: 'insensitive' } },
            { username: { contains: searchText, mode: 'insensitive' } },
            { rol: { in: rolesMatchingSearch } },
          ],
        }
      : {};

    const orderBy = sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() || 'asc' }
      : undefined;

    const [data, total] = await Promise.all([
      this.prisma.usuario.findMany({
        where,
        select: {
          id: true,
          nombre_apellido: true,
          username: true,
          activo: true,
        },
        skip: limit > 0 ? (page - 1) * limit : undefined,
        take: limit > 0 ? limit : undefined,
        orderBy,
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit: limit > 0 ? limit : total,
        totalPage: limit > 0 ? Math.ceil(total / limit) : 1,
      },
    };
  }

  findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
      select: this.selectQuery,
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const { password, password_confirmation, rol } = updateUsuarioDto;

    // Verificar que el usuario exista
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Validar si el username está siendo cambiado y si ya existe
    if (updateUsuarioDto.username) {
      const usernameTaken = await this.isExistUsername(
        updateUsuarioDto.username,
        id,
      );
      if (usernameTaken) {
        throw new BadRequestException('El username ya está registrado.');
      }
    }

    // Si el rol es ADMINISTRADOR y la contraseña es proporcionada
    if (rol === 'ADMINISTRADOR' && password) {
      if (password !== password_confirmation) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      updateUsuarioDto.password = hashedPassword;
    }

    // Excluir password_confirmation antes de guardar en BD
    delete updateUsuarioDto.password_confirmation;
    return this.prisma.usuario.update({
      where: { id },
      data: updateUsuarioDto,
      select: this.selectQuery,
    });
  }

  remove(id: number) {
    return this.prisma.usuario.update({
      where: { id },
      data: {
        activo: false,
      },
      select: this.selectQuery,
    });
  }

  async updatePassword(
    id: number,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    // Verificar si el usuario existe
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si el password actual es correcto
    const passwordValido = await bcrypt.compare(
      updatePasswordDto.password_actual,
      usuario.password,
    );
    if (!passwordValido) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Verificar si el nuevo password coincide con confirmarPassword
    if (
      updatePasswordDto.nuevo_password !==
      updatePasswordDto.confirmacion_password
    ) {
      throw new BadRequestException(
        'La nueva contraseña y su confirmación no coinciden',
      );
    }

    // Encriptar el nuevo password
    const passwordHash = await bcrypt.hash(
      updatePasswordDto.nuevo_password,
      10,
    );

    // Actualizar el password en la base de datos
    await this.prisma.usuario.update({
      where: { id },
      data: { password: passwordHash },
    });
  }
}
