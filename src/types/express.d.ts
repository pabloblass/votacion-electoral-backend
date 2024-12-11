import { JwtPayloadEntity } from '../auth/entities/jwt-payload.entity';

// Extiende el tipo de 'Request' para incluir la propiedad 'user'
declare global {
  namespace Express {
    interface Request {
      usuario: JwtPayloadEntity;
    }
  }
}
