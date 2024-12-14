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

    // Transformar el cuerpo solo si es necesario
    if (request.body) {
      // Iterar solo sobre las propiedades del cuerpo que no han sido asignadas previamente
      for (const key in request.body) {
        if (
          request.body.hasOwnProperty(key) &&
          typeof request.body[key] === 'string'
        ) {
          try {
            // Intentar convertir el valor a JSON si es un string valido
            // Solo transformamos los valores que son cadenas de texto
            request.body[key] = JSON.parse(request.body[key]);
          } catch {
            // Si no es un JSON valido, mantener el valor original
            continue;
          }
        }
      }
    }

    return next.handle();
  }
}
