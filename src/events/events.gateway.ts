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


@WebSocketGateway({ namespace: 'dingdong', transports: ['websocket'] })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  @SubscribeMessage('ping')
  handleTest(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ): string {
    client.emit('pong', data)
    console.log('web socket - data:::', data);
    console.log('web socket - client:::', client.id);
    return data;
  }

  @SubscribeMessage('login')
  handleLogin(
    @MessageBody() data: { email: string },
    @ConnectedSocket() client: Socket
  ) {
    client.join(data.email);
    console.log('login:::', data.email);
  }

  @SubscribeMessage('logout')
  handleLogout(
    @MessageBody() data: { email: string },
    @ConnectedSocket() client: Socket
  ) {
    client.leave(data.email);
    console.log('logout:::', data.email);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ) {
    client.emit('receive message', 'receive message');
    console.log('message:::', data);
  }

  afterInit(server: Server) {
    // console.log('socket-init:::', server);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('connected-socket:::', client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('dsconnected-socket:::', client.id);
  }
}
