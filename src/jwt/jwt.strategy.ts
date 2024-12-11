import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayloadEntity } from 'src/modules/auth/entities/jwt-payload.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY || 'my_secret_key',
    });
  }

  async validate(payload: JwtPayloadEntity) {
    return {
      userId: payload.id,
      username: payload.username,
      rol: payload.rol,
    };
  }
}
