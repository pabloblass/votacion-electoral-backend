import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CompartidoModule } from './compartido/compartido.module';

@Module({
  imports: [AuthModule, PrismaModule, UsuariosModule, CompartidoModule],
})
export class AppModule {}
