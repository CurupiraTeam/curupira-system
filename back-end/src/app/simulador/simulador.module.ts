import { Module } from '@nestjs/common';
import { SimuladorService } from './simulador.service';
import { PrismaModule } from 'src/commons/databases/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SimuladorService],
  exports: [SimuladorService]
})
export class SimuladorModule {}
