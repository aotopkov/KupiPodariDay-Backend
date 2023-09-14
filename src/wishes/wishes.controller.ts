import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/jwtGuard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() wishDTO: CreateWishDto, @Req() req) {
    return this.wishesService.create(wishDTO, req.user);
  }

  @Get('last')
  getLast() {
    return this.wishesService.findByOrder({ createdAt: 'DESC' }, 40);
  }

  @Get('top')
  getTop() {
    return this.wishesService.findByOrder({ copied: 'DESC' }, 20);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  get(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() wishDTO: UpdateWishDto) {
    return this.wishesService.update(id, wishDTO);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: number, @Req() req) {
    return this.wishesService.delete(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Param('id') id: number, @Req() req) {
    return this.wishesService.copy(id, req.user);
  }
}
