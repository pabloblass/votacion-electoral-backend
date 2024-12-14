import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { MunicipiosModule } from './modules/municipios/municipios.module';
import { DepartamentosModule } from './modules/departamentos/departamentos.module';
import { RecintosModule } from './modules/recintos/recintos.module';
import { MesasModule } from './modules/mesas/mesas.module';
import { CandidatosModule } from './modules/candidatos/candidatos.module';
import { ActasModule } from './modules/actas/actas.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsuariosModule,
    MunicipiosModule,
    DepartamentosModule,
    RecintosModule,
    MesasModule,
    CandidatosModule,
    ActasModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
/*export class AppModule implements OnModuleInit {
  constructor(private readonly prismaService: PrismaService) {}

  onModuleInit() {
    GlobalServices.setPrismaService(this.prismaService);
  }
}*/
