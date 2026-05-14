import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/databases/prisma.service';

@Injectable()
export class EstatisticasService {
  constructor(private readonly prisma: PrismaService) {}

  async getHistorico() {
    const dataFim = new Date();
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - 6);
    dataInicio.setHours(0, 0, 0, 0);

    const leiturasRaw = await this.prisma.leituraSensor.findMany({
      where: { lido_em: { gte: dataInicio } }
    });

    const relatosRaw = await this.prisma.relatoUsuario.findMany({
      where: { criado_em: { gte: dataInicio } }
    });

    const oficiaisRaw = await this.prisma.relatoOficial.findMany({
      where: { detectado_em: { gte: dataInicio } }
    });

    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const resultado: { date: string; iqa: number; reports: number; officialAlerts: number; }[] = [];

    for (let i = 0; i < 7; i++) {
      const dataAtual = new Date(dataInicio);
      dataAtual.setDate(dataInicio.getDate() + i);
      const diaFormatado = diasSemana[dataAtual.getDay()];

      const leiturasDoDia = leiturasRaw.filter(l => new Date(l.lido_em).getDate() === dataAtual.getDate());
      const relatosDoDia = relatosRaw.filter(r => new Date(r.criado_em).getDate() === dataAtual.getDate());
      const oficiaisDoDia = oficiaisRaw.filter(o => new Date(o.detectado_em).getDate() === dataAtual.getDate());

      const mediaIqa = leiturasDoDia.length > 0 
        ? leiturasDoDia.reduce((acc, curr) => acc + curr.valor, 0) / leiturasDoDia.length 
        : Math.floor(Math.random() * (70 - 40 + 1)) + 40; // Fallback mock se não tiver dados pro MVP

      resultado.push({
        date: diaFormatado,
        iqa: Math.round(mediaIqa),
        reports: relatosDoDia.length,
        officialAlerts: oficiaisDoDia.length
      });
    }

    return resultado;
  }
}
