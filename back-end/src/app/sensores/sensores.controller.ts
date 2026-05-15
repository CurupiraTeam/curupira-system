import { Controller, Get, Post, Body } from '@nestjs/common';
import { SensoresService } from './sensores.service';

@Controller('sensores')
export class SensoresController {
  constructor(private readonly sensoresService: SensoresService) {}

  @Post('leituras')
  async createLeitura(@Body() body: any) {
    return this.sensoresService.createLeitura(body);
  }

  @Get('metricas')
  async getMetricas() {
    return this.sensoresService.getMetricas();
  }

  @Post('logs')
  async createLog(@Body() body: any) {
    return this.sensoresService.createLog(body);
  }
}
