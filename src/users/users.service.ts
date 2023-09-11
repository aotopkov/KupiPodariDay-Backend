import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    return this.usersRepository.save(user);
  }

  async findByKey(key: string, value: string) {
    const user = await this.usersRepository.findOneBy({ [key]: value });

    return user;
  }

  async update(user: User, updateDTO: UpdateUserDto) {
    const { id } = user;
    const { email, username } = updateDTO;
    if (updateDTO.password) {
      updateDTO.password = await bcrypt.hash(updateDTO.password, 7);
    }
    const isExist = (await this.usersRepository.findOne({
      where: [{ email }, { username }],
    }))
      ? true
      : false;

    if (isExist) {
      throw new ConflictException('Пользователь уже зарегистрирован');
    }
    try {
      await this.usersRepository.update(id, updateDTO);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = await this.usersRepository.findOneBy({
        id,
      });
      return user;
    } catch {
      throw new BadRequestException('Неверные данные');
    }
  }

  async findUserWishes(id: number) {
    const users = await this.usersRepository.find({
      relations: { wishes: true },
      where: { id },
    });
    return users;
  }

  async findMany(query: string) {
    const search = await this.usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
    return search;
  }
}
