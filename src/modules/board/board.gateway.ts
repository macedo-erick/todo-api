/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { BoardService } from './board.service';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const basePath = configService.get('BASE_PATH');
const socketPath = `/${basePath}`;

@WebSocketGateway({ path: socketPath })
export class BoardGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly boardService: BoardService) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    const { s, b } = client.handshake.query;

    client.join([String(s), String(b)]);
  }

  @SubscribeMessage('createBoard')
  async create(
    @MessageBody() createBoardDto: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { s } = client.handshake.query;

    const { _id, name, userId, ...rest } = await this.boardService.create(
      JSON.parse(createBoardDto),
    );

    this.server
      .to(s)
      .emit('findAllBoards', await this.boardService.findAll(String(s)));
  }

  @SubscribeMessage('findOneBoard')
  async findOneBoard(
    @MessageBody() req: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { b } = client.handshake.query;

    this.server
      .to(b)
      .emit('findOneBoard', await this.boardService.findOne(String(b)));
  }

  @SubscribeMessage('findAllBoards')
  async findAllBoards(@ConnectedSocket() client: Socket) {
    const { s } = client.handshake.query;

    this.server
      .to(s)
      .emit('findAllBoards', await this.boardService.findAll(String(s)));
  }

  @SubscribeMessage('updateBoard')
  async update(
    @MessageBody() strUpdateBoardDto: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { b, s } = client.handshake.query;

    const updateBoardDto = JSON.parse(strUpdateBoardDto);

    const board = await this.boardService.update(String(b), updateBoardDto);

    this.server.to(b).emit('updatedBoard', board);
    this.server
      .to(s)
      .emit('findAllBoards', await this.boardService.findAll(String(s)));
  }

  @SubscribeMessage('removeBoard')
  async remove(@MessageBody() req: string, @ConnectedSocket() client: Socket) {
    const { s } = client.handshake.query;
    const { id } = JSON.parse(req);

    await this.boardService.remove(id);

    this.server
      .to(s)
      .emit('findAllBoards', await this.boardService.findAll(String(s)));
  }
}
