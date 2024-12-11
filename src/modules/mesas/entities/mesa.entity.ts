export class Mesa {
  id_recinto: number;
  nro_mesa: string;
  habilitados: number;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_modificacion: string;
  fecha_modificacion: Date;
  fecha_eliminacion: Date | null;
}
