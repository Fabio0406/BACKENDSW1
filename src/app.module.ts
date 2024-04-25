import { Module } from '@nestjs/common';
import { usuario } from './entity/user.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReunionController } from './reunion/reunion.controller';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { reunion } from './entity/reunion.entity';
import { diagrama } from './entity/diagrama.entity';
import { UserModule } from './user/user.module';
import { ReunionModule } from './reunion/reunion.module';
import { SoundSocketModule } from './websocket/websocket.module';
import { SoundSocket } from './websocket/websocket.gateway';
import { DiagramaModule } from './diagrama/diagrama.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'; // Importa la función 'join' de Node.js para trabajar con rutas
import { colaborador } from './entity/colaborado.entity';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','src', 'public'), // Ruta a tu carpeta 'public'
      serveRoot: '/public', // Ruta base para servir los archivos estáticos
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'Admin123',
      username: 'postgres',
      entities: [usuario,reunion, diagrama, colaborador],
      database: 'parcial1',
      synchronize: true,
      logging: true,
    }),
    // TypeOrmModule.forRoot({ //para desplegar, descomentar esto y comentar lo de arriba
    //   type: 'postgres',
    //   url: process.env.DATABASE_URL, // URL de conexión proporcionada por Railway
    //   entities: [usuario, reunion, diagrama, colaborador],
    //   synchronize: true, 
    //   logging: true,
    // }),
    TypeOrmModule.forFeature([usuario, reunion, diagrama,colaborador]), // Asegúrate de incluir tu entidad aquí
    UserModule,
    ReunionModule,
    SoundSocketModule,
    DiagramaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}