import { JwtPayloadEntity } from '../modules/auth/entities/jwt-payload.entity';

// Extiende el tipo de 'Request' para incluir la propiedad 'user'
/*declare global {
  namespace Express {
    interface Request {
      user: JwtPayloadEntity;
    }
  }
}*/

declare module 'express' {
  export interface Request {
    user?: JwtPayloadEntity;
  }
}
