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
import { CandidatosModule } from './modules/candidatos/candidatos.module';
import { ActasModule } from './modules/actas/actas.module';
//import { ParseFormDataMiddleware } from './multer/parse-form-data.middleware';

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
    CandidatosModule,
    ActasModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    /*{
      provide: APP_INTERCEPTOR,
      useClass: ParseFormDataMiddleware,
    },*/
  ],
})
export class AppModule {}
