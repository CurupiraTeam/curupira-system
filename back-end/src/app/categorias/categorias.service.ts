import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/databases/prisma.service';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.categoriaRelato.findMany();
  }
}
