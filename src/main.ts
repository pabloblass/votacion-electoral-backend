import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AuthGuard } from '@nestjs/passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT ?? 3000;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Activa la transformación de tipos de datos
      whitelist: true, // Filtra propiedades no definidas en el DTO
      //forbidNonWhitelisted: true, // Lanza error si existen propiedades no permitidas
    }),
  );

  //app.enableCors();
  app.enableCors({
    //origin: frontendUrl, // Permite la conexión desde la URL del frontend
    origin: true, // Permite cualquier origen
    credentials: true, // Habilita el soporte para cookies/sesiones si es necesario
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization', // Cabeceras permitidas
  });

  app.useGlobalGuards(AuthGuard('jwt') as any);

  await app.listen(port);
  logger.log(`App corriendo en puerto ${port}`);
}
bootstrap();
