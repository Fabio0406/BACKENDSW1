// colaborador.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { colaborador } from '../entity/colaborado.entity';

@Injectable()
export class ColaboradorService {
  constructor(
    @InjectRepository(colaborador)
    private colaboradorRepository: Repository<colaborador>,
  ) {}

  async agregarColaborador(usuarioId: number, reunionId: number): Promise<colaborador> {
    // Verificar si el colaborador ya existe en la reunión
    const existingColaborador = await this.colaboradorRepository.findOne({
      where: { usuarioId, reunionId },
    });
  
    if (existingColaborador) {
      return ;
    }
  
    
    const nuevoColaborador = new colaborador();
    nuevoColaborador.usuarioId = usuarioId;
    nuevoColaborador.reunionId = reunionId;
  
    return await this.colaboradorRepository.save(nuevoColaborador);
  }
  

  async obtenerColaboradoresPorReunion(reunionId: number): Promise<colaborador[]> {
    return await this.colaboradorRepository.find({
      where: { reunionId },
      relations: ['usuario'], // Esto carga la entidad de usuario relacionada
    });
  }
}
