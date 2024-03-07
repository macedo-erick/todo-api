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
import { JwtService } from '@nestjs/jwt';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

const configService = new ConfigService();

const basePath = configService.get('WS_BASE_PATH');
const socketPath = `/${basePath}`;
const corsOrigin = configService.get('CORS_ORIGINS');

@WebSocketGateway({
  path: socketPath,
  nameSpace: 'boards',
  cors: { origin: corsOrigin },
})
export class BoardGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly boardService: BoardService,
    private jwtService: JwtService,
  ) {}

  @SubscribeMessage('create')
  async create(
    @MessageBody() createBoardDto: CreateBoardDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { authorization } = socket.handshake.headers;
    const { id } = this.jwtService.decode(authorization);

    const { _id, name, userId, ...rest } = await this.boardService.create({
      ...createBoardDto,
      userId: id,
    });

    this.server.to(id).emit('onFindAll', await this.boardService.findAll(id));
  }

  @SubscribeMessage('findOne')
  async findOne(
    @MessageBody() req: { _id: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { _id } = req;

    socket.join(_id);
    socket.emit('onFindOne', await this.boardService.findOne(_id));
  }

  @SubscribeMessage('findByName')
  async findByName(
    @MessageBody() req: { name: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { authorization } = socket.handshake.headers;
    const { id } = this.jwtService.decode(authorization);

    const { name } = req;

    this.server
      .to(id)
      .emit('onFindAll', await this.boardService.findByName(id, name));
  }

  @SubscribeMessage('findAll')
  async findAll(@ConnectedSocket() socket: Socket) {
    const { authorization } = socket.handshake.headers;
    const { id } = this.jwtService.decode(authorization);

    socket.join(id);

    this.server.to(id).emit('onFindAll', await this.boardService.findAll(id));
  }

  @SubscribeMessage('update')
  async update(
    @MessageBody() updateBoardDto: UpdateBoardDto,
    @ConnectedSocket() socket: Socket,
  ) {
    await this.boardService.update(String(updateBoardDto._id), updateBoardDto);

    this.server
      .to(updateBoardDto._id)
      .emit('onFindOne', await this.boardService.findOne(updateBoardDto._id));
  }

  @SubscribeMessage('remove')
  async remove(
    @MessageBody() req: { _id: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { _id } = req;
    const { authorization } = socket.handshake.headers;
    const { id } = this.jwtService.decode(authorization);

    await this.boardService.remove(_id);

    this.server.to(id).emit('onFindAll', await this.boardService.findAll(id));
  }
}
