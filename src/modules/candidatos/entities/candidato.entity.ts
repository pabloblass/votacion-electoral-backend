import { Tipo } from '@prisma/client';

export class Candidato {
  nombre: string;
  tipo: Tipo;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_modificacion: string;
  fecha_modificacion: Date;
  fecha_eliminacion: Date | null;
}
