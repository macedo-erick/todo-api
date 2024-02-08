import { Body, Controller, Post, Res } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public/public.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth Resources')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signIn(@Body() signInDto: SigninDto, @Res() res: Response) {
    return this.authService.signIn(signInDto, res);
  }

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return this.authService.signUp(createUserDto, res);
  }
}
