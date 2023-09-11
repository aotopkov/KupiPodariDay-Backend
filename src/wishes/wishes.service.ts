import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { FindOptionsOrder, In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(wishDTO: CreateWishDto, owner: User) {
    return await this.wishesRepository.save({ ...wishDTO, owner: owner });
  }

  async findOne(id: number) {
    return await this.wishesRepository.findOne({
      relations: { owner: true, offers: { user: true } },
      where: { id },
    });
  }

  async findByOrder(order: FindOptionsOrder<Wish>, limit: number) {
    return await this.wishesRepository.find({
      relations: { owner: true },
      order: order,
      take: limit,
    });
  }

  async findMany(key: string, param: any) {
    return await this.wishesRepository.findBy({
      [key]: param,
    });
  }

  async findManyById(id: number[]) {
    return await this.wishesRepository.findBy({
      id: In(id),
    });
  }

  async update(id: number, wishDTO: UpdateWishDto, userId: number) {
    const wish = await this.wishesRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });
    if (wishDTO.price && wish.raised > 0) {
      throw new ForbiddenException();
    }
    if (wish?.owner?.id !== userId || wish.offers.length) {
      throw new BadRequestException();
    }
    await this.wishesRepository.update(id, wishDTO);
    return await this.wishesRepository.findBy({ id });
  }

  async delete(id: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });
    if (wish?.owner?.id !== userId || wish.offers.length) {
      throw new BadRequestException();
    }
    return await this.wishesRepository.remove(wish);
  }

  async copy(id: number, user: User) {
    const wish = await this.wishesRepository.findOneBy({ id });
    const isAdded = await this.wishesRepository.findOne({
      where: { owner: { id: user.id }, name: wish.name },
    });
    if (isAdded) {
      throw new ConflictException();
    }
    wish.owner = user;
    delete wish.id;
    return await this.wishesRepository.save(wish);
  }
}
