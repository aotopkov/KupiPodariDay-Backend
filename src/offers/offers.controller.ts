import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Post()
  async create(@Req() req, @Body() createOfferDTO: CreateOfferDto) {
    return this.offersService.create(req.user, createOfferDTO);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const offer = await this.offersService.findOne(id);
    if (!offer) {
      throw new NotFoundException();
    }
    return offer;
  }
}
