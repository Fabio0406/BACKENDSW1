import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors();
  const cors = require('cors');

  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
  await app.listen(3001); //Puerto del Backend
}
bootstrap();
