import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ActasService } from '../actas.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUniqueIdMesaConstraint implements ValidatorConstraintInterface {
  private actaService: ActasService;

  // Usamos ModuleRef para inyectar el servicio después de la creación
  constructor(private readonly moduleRef: ModuleRef) {}

  // Este método garantiza que se inyecte la instancia correcta del servicio
  onModuleInit() {
    this.actaService = this.moduleRef.get(ActasService, { strict: false });
    if (!this.actaService) {
      throw new NotFoundException('ActasService no encontrado');
    }
  }

  async validate(value: number, args: ValidationArguments) {
    // Si el servicio está disponible, ejecutamos la lógica de validación
    const excludeId = (args.object as any).excludeId || null;
    return this.actaService.isUniqueIdMesa(value, excludeId);
  }

  defaultMessage(args: ValidationArguments) {
    return `El campo ${args.property} debe ser único.`;
  }
}

// El decorador personalizado que utiliza el validador
export function IsUniqueIdMesa(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueIdMesaConstraint,
    });
  };
}
