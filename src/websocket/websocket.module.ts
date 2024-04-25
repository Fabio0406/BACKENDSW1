import { Module } from '@nestjs/common';
import { SoundSocket } from './websocket.gateway';
import { ReunionModule } from '../reunion/reunion.module';
import { MessagesWsService } from './websocket.service';

import { DiagramaModule } from 'src/diagrama/diagrama.module';
import { ColaboradorModule } from 'src/colaborador/colaborador.module';

@Module({
  imports: [ReunionModule, DiagramaModule, ColaboradorModule], 
  controllers: [], 
  providers: [SoundSocket, MessagesWsService],
  exports: [],
})
export class SoundSocketModule {}