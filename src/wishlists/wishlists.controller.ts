import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/jwtGuard';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Get()
  getAll() {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() wishlistDTO: CreateWishlistDto) {
    return this.wishlistsService.create(wishlistDTO);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Body() wishlistUpdDTO: UpdateWishlistDto, @Param('id') id: number) {
    return this.wishlistsService.update(id, wishlistUpdDTO);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.wishlistsService.remove(id);
  }
}
