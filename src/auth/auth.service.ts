import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { SignInDTO } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: SignInDTO) {
    const payload = { sub: user.username };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validate(username: string, password: string) {
    const user = await this.usersService.findByKey('username', username);
    const passwordEqual = await bcrypt.compare(password, user.password);
    if (user && passwordEqual) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }

    throw new UnauthorizedException({
      message: 'Неправильный юзер или пароль',
    });
  }

  async signUp(createUserDTO: CreateUserDto) {
    const checkUsername = await this.usersService.findByKey(
      'username',
      createUserDTO.username,
    );
    const chechUserEmail = await this.usersService.findByKey(
      'email',
      createUserDTO.email,
    );
    if (checkUsername || chechUserEmail) {
      throw new HttpException(
        'Пользователь с таким именем или почтой уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashpass = await bcrypt.hash(createUserDTO.password, 7);
    const user = await this.usersService.create({
      ...createUserDTO,
      password: hashpass,
    });
    return user;
  }
}
