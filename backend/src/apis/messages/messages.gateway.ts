import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { MessagesService } from './messages.service';
import { HttpException, Inject, Logger } from '@nestjs/common';

interface UserConnectionMap {
  [userId: string]: WebSocket[];
}

@WebSocketGateway({ cors: true })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // Logger
  private logger = new Logger();

  // Constructor
  constructor(
    @Inject(MessagesService)
    private messagesService: MessagesService,
  ) {}

  // Server
  @WebSocketServer()
  server: any;

  // All Connections
  userConnections: UserConnectionMap = {};

  //* Handle Connection
  async handleConnection(client) {
    try {
      const userId = await this.messagesService?.identifyUser(client);
      if (!userId) throw new HttpException('Bad Connection', 404);
      if (userId) {
        if (!this.userConnections[userId]) {
          this.userConnections[userId] = [];
        }
        this.userConnections[userId].push(client);
        this.logger.verbose(`CHAT-WEBSOCKET ${userId} Conected SucessFully ✅`);
      }
    } catch (error) {
      console.log(error);
      client.disconnect();
    }
  }

  //* Handle Disconnect
  handleDisconnect(client: WebSocket) {
    // Remove disconnected client from userConnections map
    Object.entries(this.userConnections).forEach(([userId, connections]) => {
      this.userConnections[userId] = connections.filter((c) => c !== client);
      this.logger.verbose(
        `CHAT-WEBSOCKET ${userId} Disconnected SucessFully ❌`,
      );
    });
  }

  //* On Message
  @SubscribeMessage('message')
  handleMessage(client: any, message: any) {
    const { senderId, recipientId, content, type } = message;
    if (!senderId || !recipientId || !type) return 'Something Went Wrong';
    const connections = this.userConnections[recipientId];
    this.logger.log(
      `CHAT-WEBSOCKET => New Message From ${senderId} To ${recipientId}`,
    );
    if (connections) {
      connections.forEach((connection) => {
        connection.send(
          JSON.stringify({
            senderId,
            content,
            type,
            time: new Date(),
          }),
        );
      });
    }
    if (type === 'message')
      this.messagesService.create({ senderId, recipientId, content });
    return 'Something Went Right';
  }
}

//! Sample Message
// => Message
// {
//     "senderId" : "admin",
//     "recipientId" : "member",
//     "content" : "Hi Member",
//     "type": "message"
// }
// => Headers
// auth - "....."
