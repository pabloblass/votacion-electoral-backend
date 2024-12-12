import { Estado } from '@prisma/client';

export class ActaEntity {
  id_mesa: number;
  imagen: string;
  validos_m: number;
  blancos_m: number;
  nulos_m: number;
  validos_h: number;
  blancos_h: number;
  nulos_h: number;
  votos: Array<{
    id_candidato: number;
    votos: number;
  }>;
  observado: boolean;
  estado: Estado;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_modificacion: string;
  fecha_modificacion: Date;
  fecha_eliminacion: Date | null;
  activo: boolean;
}
