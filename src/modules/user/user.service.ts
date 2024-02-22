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
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private encryptService: EncryptService,
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
    return `This action returns all user`;
  }

  async findOne(_id: string) {
    return this.userModel.findOne({ _id }).exec();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async existsByEmail(email: string) {
    return this.userModel.exists({ email });
  }

  async getUserInitials(_id: string) {
    const { firstname, lastname } = await this.userModel
      .findOne({ _id })
      .exec();

    const initials = firstname.substring(0, 1).concat(lastname.substring(0, 1));

    return {
      initials,
    };
  }
}
