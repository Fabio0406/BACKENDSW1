import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
interface connectedClients{
    [id:string] : Socket
}
@Injectable()
export class MessagesWsService{
    private connectedClients = {}

    registerClient( client : Socket){
        this.connectedClients[client.id] = client;
    }

    removeClient( clientId : string){
        delete this.connectedClients[clientId];
    }

    getConnectedClients(): number{
        return Object.keys(this.connectedClients).length;
    }
}