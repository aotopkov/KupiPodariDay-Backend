import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(wishlistDTO: CreateWishlistDto) {
    const items = [];
    const { image, name } = wishlistDTO;
    for (const item of wishlistDTO.items) {
      items.push(await this.wishesService.findOne(item));
    }
    return await this.wishlistsRepository.save({
      image,
      name,
      items,
    });
  }

  async findAll() {
    return await this.wishlistsRepository.find({
      relations: { items: true },
    });
  }

  async findOne(id: number) {
    return await this.wishlistsRepository.findOne({
      relations: { items: true },
      where: { id },
    });
  }

  async update(id: number, updateDTO: UpdateWishlistDto) {
    const { items, ...rest } = updateDTO;
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { items: true },
    });
    await this.wishlistsRepository.update(id, rest);
    wishlist.items = items.map((id: number) => ({ id }) as Wish);
    return await this.wishlistsRepository.save({
      ...rest,
      items: wishlist.items,
    });
  }

  async remove(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
    });
    return await this.wishlistsRepository.remove(wishlist);
  }
}
