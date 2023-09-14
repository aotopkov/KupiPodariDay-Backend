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
    const wish = await this.wishesService.findOne(createOfferDto.itemId);
    const raised = +wish.raised + +createOfferDto.amount;
    if (user.id === wish.owner.id) {
      throw new BadRequestException({
        message: 'Невозможно поддержать свой подарок',
      });
    }
    if (raised > wish.price) {
      throw new BadRequestException({ message: 'Уменьшите взнос' });
    }
    await this.wishesService.update(wish.id, {
      raised: raised,
    });
    const offer = this.offersRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });
    return await this.offersRepository.save(offer);
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
