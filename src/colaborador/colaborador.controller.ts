// reuniones.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { ColaboradorService } from './colaborador.service';

@Controller('colaborador')
export class ColaboradorController {
  constructor(private readonly colaboradorService: ColaboradorService) {}

  @Post('agregar')
  async agregarColaborador(@Body() body: { usuarioId: number, reunionId: number }) {
    
    console.log('body.usuarioId, body.reunionId : ',body.usuarioId, body.reunionId)
    await this.colaboradorService.agregarColaborador(body.usuarioId, body.reunionId);
    return { message: 'Usuario agregado como colaborador exitosamente' };
  }
}
