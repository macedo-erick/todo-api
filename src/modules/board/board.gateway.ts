/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { BoardService } from './board.service';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const basePath = configService.get('WS_BASE_PATH');
const socketPath = `/${basePath}`;

@WebSocketGateway({
  path: socketPath,
  nameSpace: 'boards',
  cors: { origin: '*' },
})
export class BoardGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly boardService: BoardService) {}

  @SubscribeMessage('create')
  async create(
    @MessageBody() createBoardDto: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const { s } = socket.handshake.query;

    const { _id, name, userId, ...rest } = await this.boardService.create(
      JSON.parse(createBoardDto),
    );

    this.server
      .to(s)
      .emit('findAll', await this.boardService.findAll(String(s)));
  }

  @SubscribeMessage('findOne')
  async findOne(@MessageBody() req: string, @ConnectedSocket() socket: Socket) {
    const { b } = socket.handshake.query;

    socket.emit('findOne', await this.boardService.findOne(String(b)));
  }

  @SubscribeMessage('findAll')
  async findAll(@ConnectedSocket() socket: Socket) {
    const { s } = socket.handshake.query;

    socket.emit('findAll', await this.boardService.findAll(String(s)));
  }

  @SubscribeMessage('update')
  async update(
    @MessageBody() strUpdateBoardDto: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const { b, s } = socket.handshake.query;

    const updateBoardDto = JSON.parse(strUpdateBoardDto);

    const board = await this.boardService.update(String(b), updateBoardDto);

    this.server.to(b).emit('findOne', board);
    socket.emit('findAll', await this.boardService.findAll(String(s)));
  }

  @SubscribeMessage('remove')
  async remove(@MessageBody() req: string, @ConnectedSocket() socket: Socket) {
    const { id } = JSON.parse(req);

    await this.boardService.remove(id);

    socket.emit(
      'findAll',
      await this.boardService.findAll('65c4219dfd678075ef89642f'),
    );
  }
}
