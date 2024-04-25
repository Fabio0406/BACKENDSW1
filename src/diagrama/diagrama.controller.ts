import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { diagrama } from 'src/entity/diagrama.entity';
import { Repository } from 'typeorm';
@Controller('diagrama')
export class DiagramaController {
    constructor(
        @InjectRepository(diagrama)
        private diagramaRepository: Repository<diagrama>,

    ) { }
    
    @Post('crearDiagrama')
    crearDiagrama(): diagrama {
        const nuevoDiagrama = new diagrama(); 
        return nuevoDiagrama;
    }
    @Get('obtenerDiagrama/:idDiagrama')
    obtenerDiagrama(@Param('idDiagrama') idDiagrama: string): diagrama {
        
        return diagrama[idDiagrama]; 
    }
    @Get('obtenerDiagramaIdReunion/:idReunion')
    async obtenerDiagramaIdRseunion(@Param('idReunion') idReunion: number): Promise<any> {
        
        const diagramaEncontrado = await this.diagramaRepository.findOne({ where: { idreunion: idReunion } });

        if (diagramaEncontrado) {
        
            console.log('diagrama encontrador : ',diagramaEncontrado);
            return diagramaEncontrado.contenido;
        } else {
        
            console.log("no se encontró nada", idReunion);

            return null;
        }
    }
    
}
