import { 
  ConnectedSocket, 
  MessageBody, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  OnGatewayInit, 
  SubscribeMessage, 
  WebSocketGateway, 
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'

@WebSocketGateway({ namespace: 'dingdong'})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  @SubscribeMessage('ping')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ): string {
    client.emit('pong', 'pong')
    console.log('web socket - data:::', data);
    // console.log('web socket - client:::', client);
    return data;
  }

  @SubscribeMessage('enter')
  handleEnter(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ) {
    console.log('entered enter room:::', data);
    console.log()
    client.join(data);
    // return data;
  }

  afterInit(server: Server) {
    console.log('socket-init', server);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('connecte-socket:::', client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('dsconnecte-socket:::', client.id);
  }
}
