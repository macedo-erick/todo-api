import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../common/decorators/user/user.decorator';

@Controller('users')
@ApiTags('User Resources')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findOne(@User() id: string) {
    return this.userService.findOne(id);
  }

  @Get('/initials')
  getUserInitials(@User() id: string) {
    return this.userService.getUserInitials(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
