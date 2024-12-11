import { BadRequestException } from '@nestjs/common';

export function parseId(id: string): number {
  const parsedId = Number(id);
  if (isNaN(parsedId)) {
    throw new BadRequestException('El ID proporcionado no es válido');
  }
  return parsedId;
}
