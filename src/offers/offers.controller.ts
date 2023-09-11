import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/jwtGuard';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req, @Body() createOfferDTO: CreateOfferDto) {
    return this.offersService.create(req.user, createOfferDTO);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const offer = await this.offersService.findOne(id);
    if (!offer) {
      throw new NotFoundException();
    }
    return offer;
  }
}
