import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/databases/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { 
        status: 'UP', 
        database: 'CONNECTED', 
        timestamp: new Date().toISOString() 
      };
    } catch (error) {
      return { 
        status: 'DOWN', 
        database: 'DISCONNECTED', 
        timestamp: new Date().toISOString(), 
        error: error.message 
      };
    }
  }
}
