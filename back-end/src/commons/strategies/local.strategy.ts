import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'usua_login',
      passwordField: 'usua_senha',
    });
  }

  validate(usua_login: string, usua_senha: string) {
    return this.authService.validateUser(usua_login, usua_senha);
  }
}
