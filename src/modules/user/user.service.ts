import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { EncryptService } from '../../common/modules/encrypt/encrypt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly encryptService: EncryptService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existsByEmail = await this.existsByEmail(createUserDto.email);

    if (existsByEmail) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `User already exists for given email ${[createUserDto.email]}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return new this.userModel({
      ...createUserDto,
      password: this.encryptService.encrypt(createUserDto.password),
    }).save();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(_id: string) {
    return this.userModel.findOne({ _id }).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  private async existsByEmail(email: string) {
    return this.userModel.exists({ email });
  }
}
