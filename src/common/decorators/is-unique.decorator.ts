import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { GlobalServices } from 'src/global-services';

export function IsUnique(
  modelName: string,
  field: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName,
      constraints: [modelName, field],
      options: validationOptions,
      validator: {
        // Cambiamos el validador para que acceda al prismaService de la instancia de la clase
        async validate(value: any, args: ValidationArguments) {
          const [modelName, field] = args.constraints;

          // Obtener PrismaService desde GlobalServices
          const prismaService = GlobalServices.getPrismaService();

          // Validar si el modelo existe en el cliente de Prisma
          if (!(modelName in prismaService)) {
            throw new Error(`El modelo ${modelName} no existe en Prisma.`);
          }

          // Crear la condición de busqueda
          const whereCondition: any = { [field]: value };

          // Resolver el excludeId si es una funcion
          const excludeIdValue = args.object['id'];
          console.log('Body en el decorador:', args.object);

          // Agregar la condicion para excluir ese registro
          if (excludeIdValue) {
            whereCondition['id'] = { not: excludeIdValue };
          }

          // Consultar el modelo dinamicamente
          const model = prismaService[modelName] as any;

          // Verificamos si existe un registro con el valor dado
          const result = await model.findFirst({
            where: whereCondition,
          });

          // Si el resultado es null, es unico
          return !result;
        },
        defaultMessage() {
          return `El campo ${field} ya esta en uso`;
        },
      },
    });
  };
}
