import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
  ) {}

  async create(wishlistDTO: CreateWishlistDto, user: User) {
    const { image, name, items } = wishlistDTO;
    const itemsId = items?.map((id) => ({ id }) as Wish) || [];
    return await this.wishlistsRepository.save({
      image,
      name,
      items: itemsId,
      owner: user,
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
