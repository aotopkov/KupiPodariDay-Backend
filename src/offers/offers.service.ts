import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findOne(createOfferDto.id);
    if (user.id === wish.owner.id) {
      throw new BadRequestException();
    }
    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new BadRequestException();
    }
    await this.wishesService.update(
      wish.id,
      {
        raised: wish.raised + createOfferDto.amount,
      },
      user.id,
    );
    const { id } = await this.offersRepository.save({
      ...createOfferDto,
      user,
      item: wish,
    });

    return await this.offersRepository.findBy({ id });
  }

  async findAll() {
    return this.offersRepository.find({ relations: ['item', 'user'] });
  }

  async findOne(id: number) {
    return this.offersRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });
  }
}
