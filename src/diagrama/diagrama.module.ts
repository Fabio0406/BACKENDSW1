import { Module } from '@nestjs/common';
import { DiagramaController } from './diagrama.controller';
import { MessagesWsService } from 'src/websocket/websocket.service';
import { DiagramaService } from './diagrama.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diagrama } from 'src/entity/diagrama.entity';
import { usuario } from 'src/entity/user.entity';
import { reunion } from 'src/entity/reunion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([diagrama, usuario,reunion])],
  controllers: [DiagramaController],
  providers: [MessagesWsService, DiagramaService],
  exports: [DiagramaService]
})
export class DiagramaModule { }
