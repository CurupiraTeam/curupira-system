import { Controller, Get } from '@nestjs/common';
import { EstatisticasService } from './estatisticas.service';

@Controller('estatisticas')
export class EstatisticasController {
  constructor(private readonly estatisticasService: EstatisticasService) {}

  @Get('historico')
  async getHistorico() {
    return this.estatisticasService.getHistorico();
  }
}
