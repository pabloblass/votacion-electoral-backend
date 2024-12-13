import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

export function IsUnique(
  modelName: string,
  field: string,
  excludeId?: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName,
      constraints: [modelName, field, excludeId],
      options: validationOptions,
      validator: {
        // Cambiamos el validador para que acceda al prismaService de la instancia de la clase
        async validate(value: any, args: ValidationArguments) {
          const [modelName, field, excludeId] = args.constraints;

          // Acceder a PrismaService desde la instancia de la clase
          const prismaService: PrismaService = object.prismaService;

          if (!prismaService) {
            throw new Error('PrismaService no econtrado');
          }

          // Crear la condición de búsqueda
          const whereCondition: any = { [field]: value };

          // Si se pasa un `excludeId`, agregamos la condición para excluir ese registro
          if (excludeId) {
            whereCondition['id'] = { not: excludeId };
          }

          // Consultar el modelo dinámicamente
          const model = prismaService[modelName] as any; // Asegúrate de que `model` sea tratado como un tipo válido

          // Verificamos si existe un registro con el valor dado
          const result = await model.findFirst({
            where: whereCondition,
          });

          // Si el resultado es `null`, es único
          return !result;
        },
        defaultMessage() {
          return `El campo ${field} ya esta en uso`;
        },
      },
    });
  };
}
