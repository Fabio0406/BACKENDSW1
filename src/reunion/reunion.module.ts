import { Module } from '@nestjs/common';
import { ReunionController } from './reunion.controller';
import { ReunionService } from './reunion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { reunion } from '../entity/reunion.entity';
import { UserModule } from '../user/user.module'; // Importa UserModule si necesitas acceder al servicio de usuario
import { usuario } from 'src/entity/user.entity';
import { DiagramaModule } from 'src/diagrama/diagrama.module';
import { diagrama } from 'src/entity/diagrama.entity';
import { ColaboradorModule } from 'src/colaborador/colaborador.module';
import { colaborador } from 'src/entity/colaborado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([reunion, usuario,diagrama,colaborador]), UserModule, DiagramaModule, DiagramaModule, ColaboradorModule], // Importa UserModule si es necesario
  controllers: [ReunionController],
  providers: [ReunionService],
  exports: [ReunionService], // Exporta ReunionService si planeas usarlo en otros módulos
})
export class ReunionModule {}
