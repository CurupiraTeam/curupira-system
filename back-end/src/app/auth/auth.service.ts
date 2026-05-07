import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from 'src/models/dtos/auth/login.dto';
import * as bcrypt from 'bcrypt';
import { UserPayload } from 'src/models/interfaces/auth/userPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (user && (await bcrypt.compare(loginDto.senha, user.senha))) {
      const { senha, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.nome,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
