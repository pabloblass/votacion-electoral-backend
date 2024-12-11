import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { PrismaModule } from './prisma/prisma.module';
import { CompartidoModule } from './modules/compartido/compartido.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { MunicipiosModule } from './modules/municipios/municipios.module';
import { DepartamentosModule } from './modules/departamentos/departamentos.module';
import { RecintosModule } from './modules/recintos/recintos.module';
import { MesasModule } from './modules/mesas/mesas.module';

@Module({
  imports: [
    PrismaModule,
    CompartidoModule,
    AuthModule,
    UsuariosModule,
    MunicipiosModule,
    DepartamentosModule,
    RecintosModule,
    MesasModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
