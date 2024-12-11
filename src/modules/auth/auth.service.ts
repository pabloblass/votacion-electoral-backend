import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtPayloadEntity } from './entities/jwt-payload.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const userFound = await this.usuariosService.findByUsername(
      loginDto.username,
    );
    if (
      userFound &&
      (await bcrypt.compare(loginDto.password, userFound.password))
    ) {
      return userFound;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload: JwtPayloadEntity = {
      id: user.id,
      username: user.username,
      rol: user.rol,
    };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: user,
    };
  }
}
