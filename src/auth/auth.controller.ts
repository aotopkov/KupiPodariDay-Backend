import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalGuard } from './localGuard';
import { User } from 'src/users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signIn(@Body() req: User) {
    return this.authService.auth(req);
  }

  @Post('signup')
  async signUp(@Body() userDTO: CreateUserDto) {
    const user = await this.authService.signUp(userDTO);
    return user;
  }
}
