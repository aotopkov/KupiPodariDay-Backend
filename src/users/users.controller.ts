import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtGuard } from 'src/auth/jwtGuard';
import { WishesService } from 'src/wishes/wishes.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private wishesServise: WishesService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = await this.usersService.findByKey(
      'id',
      req.user.id,
    );
    return rest;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  update(@Req() req, @Body() body) {
    return this.usersService.update(req.user, body);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getMeWishes(@Req() req) {
    const users = await this.usersService.findUserWishes(req.user.id);
    const wishes = users.map((user) => user.wishes);
    return wishes;
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  getUser(@Param('username') username) {
    return this.usersService.findByKey('username', username);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  getUsersWishes(@Param('username') username) {
    return this.wishesServise.findMany('owner', { username });
  }

  @Post('find')
  findUsers(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }
}
