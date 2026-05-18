import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaService } from 'src/commons/databases/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NivelLog, StatusRelato } from '@prisma/client';

@Injectable()
export class SimuladorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SimuladorService.name);
  private sensorInterval!: NodeJS.Timeout;
  private oficialInterval!: NodeJS.Timeout;
  private usuarioInterval!: NodeJS.Timeout;
  private prunerInterval!: NodeJS.Timeout;
  private resolverInterval!: NodeJS.Timeout;

  private readonly SENSOR_ID = 'simulador-sensor-01';
  private readonly USER_EMAIL = 'simulador@curupira.com';

  private readonly bairrosManaus = [
    { nome: 'Centro', lat: -3.1316, lng: -60.0242 },
    { nome: 'Adrianópolis', lat: -3.1092, lng: -60.0117 },
    { nome: 'Parque Dez de Novembro', lat: -3.0898, lng: -60.0061 },
    { nome: 'Alvorada', lat: -3.0911, lng: -60.0444 },
    { nome: 'Coroado', lat: -3.1022, lng: -59.9792 },
    { nome: 'Ponta Negra', lat: -3.0617, lng: -60.0767 },
    { nome: 'Distrito Industrial', lat: -3.1353, lng: -59.9803 },
    { nome: 'Compensa', lat: -3.1083, lng: -60.0594 },
    { nome: 'Cidade Nova', lat: -3.0319, lng: -59.9744 }
  ];

  private readonly descricoesRelatos = [
    'Nuvem de fumaça densa avistada próximo a área residencial.',
    'Cheiro forte de fumaça invadindo as casas e causando desconforto respiratório.',
    'Queimada de lixo em terreno baldio com fumaça escura se espalhando.',
    'Névoa seca e fuligem cobrindo os carros e quintais.',
    'Fumaça espessa na pista dificultando a visibilidade dos motoristas.',
    'Odor químico irritante percebido no ar nas proximidades.',
    'Fogo se alastrando lentamente em vegetação rasteira à beira da via.'
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async onModuleInit() {
    this.logger.log('🌱 Inicializando o Motor de Simulação do Curupira...');

    try {
      // 1. Garantir que o sensor de simulação existe no banco
      await this.prisma.dispositivoSensor.upsert({
        where: { id: this.SENSOR_ID },
        update: {},
        create: {
          id: this.SENSOR_ID,
          nome: 'Sensor Simulado Curupira (Manaus)',
          latitude: -3.1019,
          longitude: -60.0250
        }
      });

      // 2. Garantir que o usuário simulador existe no banco para os relatos
      await this.prisma.usuario.upsert({
        where: { email: this.USER_EMAIL },
        update: {},
        create: {
          nome: 'Curupira Simulador',
          email: this.USER_EMAIL,
          senha: 'senha_simulada_nao_utilizada_diretamente',
          papel: 'CIDADAO'
        }
      });

      this.logger.log('✅ Entidades simuladas garantidas no banco de dados.');

      // 3. Iniciar as tarefas periódicas
      this.startSensorSimulation();
      this.startOficialSimulation();
      this.startUsuarioSimulation();
      this.startReportResolver();
      this.startPruner();

      this.logger.log('🚀 Simulações ativas e rodando em segundo plano!');
    } catch (err: any) {
      this.logger.error('Erro ao configurar o motor de simulação:', err.message);
    }
  }

  private startSensorSimulation() {
    // A cada 10 segundos gera leitura de sensores e envia via WebSocket
    this.sensorInterval = setInterval(async () => {
      try {
        const pm25 = parseFloat((15 + Math.random() * 80).toFixed(1)); // valor entre 15.0 e 95.0 µg/m³
        
        // Gravar no banco de dados
        await this.prisma.leituraSensor.create({
          data: {
            dispositivo_id: this.SENSOR_ID,
            valor: pm25,
            unidade: 'µg/m³'
          }
        });

        // Registrar log de dispositivo
        let nivel: NivelLog = NivelLog.INFO;
        let msg = `Leitura PM2.5 realizada com sucesso: ${pm25} µg/m³`;
        if (pm25 > 55) {
          nivel = NivelLog.AVISO;
          msg = `Alerta: Qualidade do ar inadequada detectada! PM2.5 = ${pm25} µg/m³`;
        } else if (pm25 > 80) {
          nivel = NivelLog.ERRO;
          msg = `CRÍTICO: Qualidade do ar perigosa detectada! PM2.5 = ${pm25} µg/m³`;
        }

        await this.prisma.logDispositivo.create({
          data: {
            dispositivo_id: this.SENSOR_ID,
            nivel,
            mensagem: msg,
            detalhes: { pm25, gerado_em: new Date().toISOString() }
          }
        });

        // Emitir evento para o WebSocket Gateway enviar em tempo real ao front
        this.eventEmitter.emit('sensor.update', {
          valor: String(pm25),
          timestamp: new Date().toISOString()
        });

        this.logger.debug(`[Simulador] Sensor atualizado: ${pm25} µg/m³`);
      } catch (err: any) {
        this.logger.error('Erro na simulação do sensor:', err.message);
      }
    }, 10000);
  }

  private startOficialSimulation() {
    // A cada 6 minutos gera um relato oficial realista (INPE / SELVA / INPA)
    this.oficialInterval = setInterval(async () => {
      try {
        const fontes = ['INPE', 'SELVA', 'INPA'];
        const fonte = fontes[Math.floor(Math.random() * fontes.length)];
        const categoriaId = Math.random() > 0.4 ? 2 : 1; // 2 = Queimada, 1 = Fumaça
        
        // Escolhe bairro aleatório para coordenadas realistas
        const bairro = this.bairrosManaus[Math.floor(Math.random() * this.bairrosManaus.length)];
        const offsetLat = (Math.random() - 0.5) * 0.01;
        const offsetLng = (Math.random() - 0.5) * 0.01;

        const relatoOficial = await this.prisma.relatoOficial.create({
          data: {
            fonte,
            id_externo: `ext-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            categoria_id: categoriaId,
            latitude: bairro.lat + offsetLat,
            longitude: bairro.lng + offsetLng,
            detectado_em: new Date(),
            metadados: {
              confianca: Math.floor(70 + Math.random() * 30), // 70% a 100% de confiança
              sensor_satelite: 'AQUA_M-T',
              temperatura_brilho: 312.4
            }
          }
        });

        this.eventEmitter.emit('relatos.change');
        this.logger.log(`[Simulador] Novo relato OFICIAL criado de ${fonte} no bairro ${bairro.nome}`);
      } catch (err: any) {
        this.logger.error('Erro na simulação de relato oficial:', err.message);
      }
    }, 360000);
  }

  private startUsuarioSimulation() {
    // A cada 8 minutos cria um relato de cidadão simulado
    this.usuarioInterval = setInterval(async () => {
      try {
        // Encontra o usuário simulador no banco
        const user = await this.prisma.usuario.findUnique({
          where: { email: this.USER_EMAIL }
        });

        if (!user) return;

        const categoriaId = Math.floor(Math.random() * 3) + 1; // 1, 2 ou 3 (Fumaça, Queimada, Químico)
        const bairro = this.bairrosManaus[Math.floor(Math.random() * this.bairrosManaus.length)];
        const offsetLat = (Math.random() - 0.5) * 0.015;
        const offsetLng = (Math.random() - 0.5) * 0.015;

        const descricao = this.descricoesRelatos[Math.floor(Math.random() * this.descricoesRelatos.length)];

        await this.prisma.relatoUsuario.create({
          data: {
            usuario_id: user.id,
            categoria_id: categoriaId,
            latitude: bairro.lat + offsetLat,
            longitude: bairro.lng + offsetLng,
            descricao,
            referencia_endereco: `Próximo ao bairro ${bairro.nome}`,
            status: StatusRelato.ATIVO
          }
        });

        this.eventEmitter.emit('relatos.change');
        this.logger.log(`[Simulador] Novo relato de CIDADÃO criado em ${bairro.nome}: "${descricao}"`);
      } catch (err: any) {
        this.logger.error('Erro na simulação de relato de usuário:', err.message);
      }
    }, 480000);
  }

  private startPruner() {
    // A cada 10 minutos, limpa dados de simulação antigos para manter o banco limpo
    this.prunerInterval = setInterval(async () => {
      try {
        this.logger.log('🧹 Iniciando limpeza de dados de simulação antigos...');
        
        // 1. Limpar leituras de sensores simulados com mais de 30 minutos
        const trintaMinutosAtras = new Date(Date.now() - 30 * 60 * 1000);
        const leiturasDeletadas = await this.prisma.leituraSensor.deleteMany({
          where: {
            dispositivo_id: this.SENSOR_ID,
            lido_em: { lt: trintaMinutosAtras }
          }
        });

        // 2. Limpar logs do dispositivo de simulação com mais de 1 hora
        const umaHoraAtras = new Date(Date.now() - 60 * 60 * 1000);
        await this.prisma.logDispositivo.deleteMany({
          where: {
            dispositivo_id: this.SENSOR_ID,
            criado_em: { lt: umaHoraAtras }
          }
        });

        // 3. Limpar relatos oficiais antigos com mais de 4 horas
        const quatroHorasAtras = new Date(Date.now() - 4 * 60 * 60 * 1000);
        const oficiaisDeletados = await this.prisma.relatoOficial.deleteMany({
          where: {
            fonte: { in: ['INPE', 'SELVA', 'INPA'] },
            detectado_em: { lt: quatroHorasAtras }
          }
        });

        // 4. Limpar relatos de usuários de simulação antigos com mais de 4 horas
        const user = await this.prisma.usuario.findUnique({
          where: { email: this.USER_EMAIL }
        });
        let usuariosDeletados = 0;
        if (user) {
          const res = await this.prisma.relatoUsuario.deleteMany({
            where: {
              usuario_id: user.id,
              criado_em: { lt: quatroHorasAtras }
            }
          });
          usuariosDeletados = res.count;
        }

        this.logger.log(
          `✅ Limpeza completa! Prunados: ${leiturasDeletadas.count} leituras, ${oficiaisDeletados.count} relatos oficiais, ${usuariosDeletados} relatos de usuários.`
        );
      } catch (err: any) {
        this.logger.error('Erro na limpeza do banco:', err.message);
      }
    }, 600000); // 10 minutos
  }

  private startReportResolver() {
    // A cada 2 minutos busca relatos de cidadãos simulados ativos criados há mais de 15 minutos
    // e os resolve alterando status para StatusRelato.RESOLVIDO
    this.resolverInterval = setInterval(async () => {
      try {
        const user = await this.prisma.usuario.findUnique({
          where: { email: this.USER_EMAIL }
        });

        if (!user) return;

        const quinzeMinutosAtras = new Date(Date.now() - 15 * 60 * 1000);

        const relatosParaResolver = await this.prisma.relatoUsuario.findMany({
          where: {
            usuario_id: user.id,
            status: StatusRelato.ATIVO,
            criado_em: { lt: quinzeMinutosAtras }
          }
        });

        if (relatosParaResolver.length > 0) {
          await this.prisma.relatoUsuario.updateMany({
            where: {
              id: { in: relatosParaResolver.map(r => r.id) }
            },
            data: {
              status: StatusRelato.RESOLVIDO
            }
          });

          this.logger.log(`[Simulador] Resolvidos ${relatosParaResolver.length} relatos antigos de cidadãos.`);
          this.eventEmitter.emit('relatos.change');
        }
      } catch (err: any) {
        this.logger.error('Erro na resolução de relatos antigos:', err.message);
      }
    }, 120000);
  }

  onModuleDestroy() {
    this.logger.log('🛑 Parando o Motor de Simulação do Curupira...');
    if (this.sensorInterval) clearInterval(this.sensorInterval);
    if (this.oficialInterval) clearInterval(this.oficialInterval);
    if (this.usuarioInterval) clearInterval(this.usuarioInterval);
    if (this.resolverInterval) clearInterval(this.resolverInterval);
    if (this.prunerInterval) clearInterval(this.prunerInterval);
  }
}
