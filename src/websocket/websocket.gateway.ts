import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ReunionService } from 'src/reunion/reunion.service';
import { DiagramaService } from 'src/diagrama/diagrama.service';
import { MessagesWsService } from './websocket.service';
import { diagrama } from 'src/entity/diagrama.entity';import { ColaboradorService } from 'src/colaborador/colaborador.service';
 '../entity/diagrama.entity'

@WebSocketGateway({ cors: true, namespace: '/reunion' })
export class SoundSocket implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private diagramas: { [idDiagrama: string]: diagrama } = {};

  @WebSocketServer() server: Socket;

  constructor(private reunionController: ReunionService, private diagramaService: DiagramaService, private readonly messageWsService: MessagesWsService , private colaboradorService: ColaboradorService) { }

  afterInit(server: Socket) {
    console.log('Servidor WebSocket iniciado.');
  }

  handleConnection(client: Socket) {
    this.messageWsService.registerClient(client);
    
    this.server.emit('clientes conectados: ', this.messageWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
  }

  @SubscribeMessage('crearReunion')
  async handleCrearReunion(client: Socket, data: any) {
    console.log('creando reunion data.usuarioID : ', data.usuarioId);
    console.log('creando reunion data: ', data);
    try {

      const reunion = await this.reunionController.crearReunion(data.usuarioId, data);
      console.log('creando reunion idd: ', reunion);

      console.log('pasando datos al front', reunion, reunion.codigo);
      client.join(`reunion-${reunion.id}-${reunion.codigo}`);
      client.emit('reunionCreada', { reunion, codigo: reunion.codigo, usuarioId: data.usuarioId});
    } catch (error) {
      console.error('Error al crear la reunión:', error);
      client.emit('errorCreacionReunion', 'No se pudo crear la reunión. Por favor, intenta nuevamente.');
    }
  }

  @SubscribeMessage('unirseReunion')
  async handleUnirseReunion(client: Socket, data: { codigoReunion: string, password: string, usuarioId : number }) {
    const { codigoReunion, password,usuarioId } = data;
    console.log('data : ', data);
    console.log('codigo : ', codigoReunion);
    console.log('contrasena : ', password);
    console.log('usuarioId : ', usuarioId);
    const reunion = await this.reunionController.validarCodigoYContraseña(codigoReunion, password);
    const reunionId = await this.reunionController.obtenerReunionPorCodigo(codigoReunion);
    const addColaborador = await this.colaboradorService.agregarColaborador(usuarioId, reunionId.id);
    if (reunion) {
      client.join(`/reunion-${reunion.id}-${reunion.codigo}`);
      console.log('enviando reunion al front : ', reunion)
      client.emit('unirseReunionExitoso', reunion);

      client.broadcast.to(`/reunion-${reunion.id}-${reunion.codigo}`).emit('usuarioUnido', { usuarioId: client.id });
    } else {
      client.emit('errorUnirseReunion', 'Código o contraseña incorrectos');
    }
  }

  @SubscribeMessage('actualizarDiagrama')
  async handleActualizarDiagrama(client: any, datas: { id: number, data: any }) {
    const { id, data } = datas;
    if (Array.isArray([data])) {
      const code = await this.diagramaService.obtenerCodigoReunion(id);
      client.join(`/reunion-${id}-${code}`);

      client.broadcast.to(`/reunion-${id}-${code}`).emit('actualizarDiagramas', data);
    } else {
      console.error('Los cambios deben ser un array.');
    }
  }

  @SubscribeMessage('guardarDiagrama')
  async handleGuardarDiagrama(client: any, data: { reunionId: number, diagrama: any }) {
    console.log('data: ', data)
    const { reunionId, diagrama } = data;
    console.log('Diagrama recibido para actualizar en la reunión', reunionId);
    console.log('Diagrama:', diagrama);

    try {
      const diagramaData = JSON.parse(diagrama);

      const guardado = await this.diagramaService.guardarDiagrama(reunionId, diagramaData);
      console.log('se guardó? : ', guardado)
      client.broadcast.to(`/reuniones/${reunionId}`).emit('actualizarDiagrama', diagrama);
    } catch (error) {
      console.error('Error al manejar y guardar el diagrama:', error);
    }
  }

}
