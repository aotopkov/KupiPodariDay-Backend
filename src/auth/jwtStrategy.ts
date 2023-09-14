import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userSevice: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwt_secret',
    });
  }

  async validate(payload) {
    const user = this.userSevice.findByID(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
