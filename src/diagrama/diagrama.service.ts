import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as go from 'gojs';
import { Server, Socket } from 'socket.io';
import { diagrama } from 'src/entity/diagrama.entity';
import { reunion } from 'src/entity/reunion.entity';
import { usuario } from 'src/entity/user.entity';
import { ReunionService } from 'src/reunion/reunion.service';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class DiagramaService {
  private diagram: go.Diagram | undefined;
  private server: Server;
  private reunionController: ReunionService;
  private diagramas: { [idReunion: number]: go.Diagram } = {};

  constructor(
    @InjectRepository(diagrama)
    private diagramaRepository: Repository<diagrama>,
    @InjectRepository(usuario)
    private reunionRepository: Repository<reunion>,
    private readonly entityManager: EntityManager
  ) {
    this.diagram = new go.Diagram();
  }
  setServerInstance(server: Server) {
    this.server = server;
  }

  setReunionControllerInstance(reunionController: ReunionService) {
    this.reunionController = reunionController;
  }

  getDiagramInstance() {
    return this.diagram;
  }

  async handleDiagramChanges(idReunion: number, changes: any) {
    const diagramas = await this.entityManager.findOne(diagrama, { where: { idreunion: idReunion } });

    if (diagramas) {
      let contenido = diagramas.contenido;
      console.log('contenido antes : ', contenido);
      if (contenido) {
        try {
          contenido = JSON.parse(contenido);
          console.log('contenido desp: ', contenido);

          const { type, nodeKey, nodeName } = changes;

          if (type === 'addNode') {

            const newNode = {
              key: nodeKey.toString(),
              text: nodeName.text || 'Nuevo Nodo',

            };
          } else if (type === 'changeNodeName') {

            const node = contenido.nodeDataArray.find((node) => node.key === nodeKey.toString());
            if (node) {
              node.text = nodeName.text;
            }
          }

          // Convertir el objeto JavaScript nuevamente a una cadena JSON antes de guardar en la base de datos
          diagramas.contenido = JSON.stringify(contenido);

          // Guardar los cambios en la base de datos
          await this.entityManager.save(diagrama, diagramas);

          // Emitir los cambios a los clientes conectados a través del socket
          
        } catch (error) {
          console.error('Error al parsear contenido como JSON:', error);
        }
      } else {
        console.error('El contenido del diagrama en la base de datos está en un formato incorrecto.');
      }
    } else {
      console.error('El diagrama para la reunión no existe.');
    }
  }



  async obtenerDiagramaPorReunion(idReunion: number): Promise<go.Model> {
    const diagramaGet = await this.diagramaRepository.findOne({ where: { idreunion: idReunion } });

    // Verificar si se encontró un diagrama en la base de datos
    if (!diagramaGet || !diagramaGet.contenido) {
      throw new Error('Diagrama no encontrado');
    }

    // Convertir el JSON del diagrama en un modelo de diagrama GoJS
    const modeloDiagrama: go.Model = go.Model.fromJson(diagramaGet.contenido);

    return modeloDiagrama;
  }

  async obtenerCodigoReunion(idReunion: number): Promise<string> {
    const codigoGet = await this.reunionRepository.findOne({ where: { id: idReunion } });
    return codigoGet.codigo;
  }

  async crearNuevaInstanciaDiagrama(data: any, reunionId: number): Promise<diagrama> {
    console.log(data);

    const nuevoDiagrama = new diagrama();
    nuevoDiagrama.titulo = data.titulo;
    nuevoDiagrama.descripcion = data.descripcion;
    nuevoDiagrama.contenido = null;
    nuevoDiagrama.idusuario = data.idusuario;
    nuevoDiagrama.idreunion = reunionId;
    nuevoDiagrama.reunion = null;
    return await this.diagramaRepository.save(nuevoDiagrama);
  }

  crearDiagrama(): string {
    const diagramModel = this.diagram.model.toJson();


    return JSON.stringify(diagramModel);
  }

  async guardarDiagrama(reunionId: number, diagramaData: any): Promise<string> {
    try {

      const diagramaExistente = await this.diagramaRepository.findOne({ where: { idreunion: reunionId } });

      if (diagramaExistente) {

        diagramaExistente.contenido = diagramaData;



        await this.diagramaRepository.save(diagramaExistente)

        return 'Diagrama actualizado exitosamente.';
      } else {
        return 'Diagrama no encontrado para la reunión proporcionada.';
      }
    } catch (error) {
      console.error('Error al guardar el diagrama:', error);
      throw new Error('Error al guardar el diagrama.');
    }
  }

}
