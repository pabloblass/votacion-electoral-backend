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
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  app.useGlobalGuards(AuthGuard('jwt') as any);

  await app.listen(port);
  logger.log(`App corriendo en puerto ${port}`);
}
bootstrap();
