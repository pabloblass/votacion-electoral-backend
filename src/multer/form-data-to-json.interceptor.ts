import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FormDataToJsonInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Transformar el cuerpo si es necesario
    if (request.body) {
      for (const key in request.body) {
        if (request.body.hasOwnProperty(key)) {
          try {
            // Intentar convertir el valor a JSON si es un string válido
            request.body[key] = JSON.parse(request.body[key]);
          } catch (error) {
            // Si no es un JSON válido, mantener el valor original
            throw new Error(`Error al transformar los datos. ${error}`);
          }
        }
      }
    }

    return next.handle();
  }
}
