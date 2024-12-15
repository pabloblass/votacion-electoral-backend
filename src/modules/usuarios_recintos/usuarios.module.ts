import { Module } from '@nestjs/common';
import { UsuariosRecintoService } from './usuarios.service';
import { UsuariosRecintoController } from './usuarios.controller';

@Module({
  controllers: [UsuariosRecintoController],
  providers: [UsuariosRecintoService],
  exports: [UsuariosRecintoService],
})
export class UsuariosRecintoModule {}
