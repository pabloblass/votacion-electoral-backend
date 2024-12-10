import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUsuarioDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: { username: createUserDto.username, password: hashedPassword },
    });
  }

  async findUserByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }
}
