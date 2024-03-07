/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { EncryptService } from '../../common/modules/encrypt/encrypt.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private encryptService: EncryptService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SigninDto) {
    const user = await this.userService.findByEmail(signInDto.email);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not exists',
          timestamp: new Date().getTime(),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const validPassword = this.encryptService.compare(
      signInDto.password,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException({
        error: 'Password mismatch',
        timestamp: new Date().getTime(),
      });
    }

    const { _id: id, email, firstname, lastname } = user;

    return {
      id,
      email,
      access_token: this.jwtService.sign({
        id,
        email,
        fullName: firstname.concat(' ').concat(lastname),
      }),
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);

    return { message: 'User registered sucessfully' };
  }
}
