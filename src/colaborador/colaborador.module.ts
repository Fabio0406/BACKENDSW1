import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diagrama } from 'src/entity/diagrama.entity';
import { usuario } from 'src/entity/user.entity';
import { reunion } from 'src/entity/reunion.entity';
import { colaborador } from 'src/entity/colaborado.entity';
import { ColaboradorController } from './colaborador.controller';
import { ColaboradorService } from './colaborador.service';
@Module({
  imports: [TypeOrmModule.forFeature([diagrama, usuario,reunion,colaborador])],
  controllers: [ColaboradorController],
  providers: [ColaboradorService],
  exports: [ColaboradorService]
})
export class ColaboradorModule { }
