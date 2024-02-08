import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import { EncryptService } from '../../common/modules/encrypt/encrypt.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private encryptService: EncryptService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SigninDto, res: Response) {
    const user = await this.userService.findByEmail(signInDto.email);

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

    const { _id: id, email } = user;

    return res
      .status(HttpStatus.OK)
      .send({ id, email, access_token: this.jwtService.sign({ id, email }) });
  }

  signUp(createUserDto: CreateUserDto, res: Response) {}
}
