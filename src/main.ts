import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AuthGuard } from '@nestjs/passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT ?? 3000;

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Activa la transformación de tipos de datos
      whitelist: true, // Filtra propiedades no definidas en el DTO
      //forbidNonWhitelisted: true, // Lanza error si existen propiedades no permitidas
    }),
  );

  app.enableCors();

  app.useGlobalGuards(AuthGuard('jwt') as any);

  await app.listen(port);
  logger.log(`App corriendo en puerto ${port}`);
}
bootstrap();
