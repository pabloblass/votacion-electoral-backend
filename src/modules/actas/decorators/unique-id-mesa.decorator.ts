import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ActasService } from '../actas.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUniqueMesaValidator implements ValidatorConstraintInterface {
  constructor(private readonly actaService: ActasService) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const excludeId = args.object['excludeId'] ?? null; // Si hay un ID a excluir
    return this.actaService.isUniqueIdMesa(value, excludeId);
  }

  defaultMessage(args: ValidationArguments): string {
    return `El valor para "${args.property}" ya está en uso.`;
  }
}
