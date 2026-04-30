import { INestApplication, Logger } from '@nestjs/common';

export class HealthCheckService {
    private static readonly logger = new Logger(HealthCheckService.name);

    public static setup(app: INestApplication, routePath: string = '/ping'): void {
        const httpAdapter = app.getHttpAdapter();
        const instance = httpAdapter.getInstance();

        instance.get(routePath, (req, res) => {
            res.status(200).send('pong');
        });

        HealthCheckService.logger.log(`Rota de Health Check (Ping) configurada em: ${routePath}`);
    }
}
