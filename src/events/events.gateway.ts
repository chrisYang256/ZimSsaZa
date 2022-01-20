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
  handleMessage(
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
    @MessageBody() data: { email: string, id: number },
    @ConnectedSocket() client: Socket
  ) {
    // const nameSpace = client.nsp;
    // console.log('login:::', data);
    // const something = socketDB[nameSpace.name][client.id] = data.email;
    // nameSpace.emit('onlineList', Object.values(socketDB[nameSpace.name]))
    client.join(data.email)
    client.emit('ping', { msg: "holla" })
    // return data;
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
