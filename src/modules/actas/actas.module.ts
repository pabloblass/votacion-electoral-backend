import { Module } from '@nestjs/common';
import { ActasService } from './actas.service';
import { ActasController } from './actas.controller';

@Module({
  controllers: [ActasController],
  providers: [ActasService],
})
export class ActasModule {}
