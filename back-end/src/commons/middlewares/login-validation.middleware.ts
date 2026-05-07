import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { LoginDto } from 'src/models/dtos/auth/login.dto';

@Injectable()
export class LoginValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    const loginDto = new LoginDto();
    loginDto.email = body?.email;
    loginDto.senha = body?.senha;

    const validations = await validate(loginDto);

    if (validations.length) {
      throw new BadRequestException(
        validations.reduce((acc, curr: any) => {
          return [...acc, ...Object.values(curr.constraints)];
        }, []),
      );
    }

    next();
  }
}
