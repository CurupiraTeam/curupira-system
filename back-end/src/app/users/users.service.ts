import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/commons/databases/prisma.service';
import { CreateUserDto } from 'src/models/dtos/users/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, senha, nome } = createUserDto;

    // Verificar se usuário já existe
    const userExists = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('E-mail já cadastrado no sistema');
    }

    // Hash da senha
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Criar usuário
    return this.prisma.usuario.create({
      data: {
        email,
        nome,
        senha: hashedPassword,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        criado_em: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }
}
