import { Module } from '@nestjs/common';
import { RecintosService } from './recintos.service';
import { RecintosController } from './recintos.controller';

@Module({
  controllers: [RecintosController],
  providers: [RecintosService],
})
export class RecintosModule {}
