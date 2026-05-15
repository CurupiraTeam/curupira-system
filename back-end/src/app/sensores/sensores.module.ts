import { Module } from '@nestjs/common';
import { SensoresController } from './sensores.controller';
import { SensoresService } from './sensores.service';
import { PrismaModule } from 'src/commons/databases/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SensoresController],
  providers: [SensoresService]
})
export class SensoresModule {}
