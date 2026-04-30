import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Swagger } from './commons/configs/swagger/swagger.config';
import { HealthCheckService } from './commons/health/health-check.service';
import { ServicesUtils } from './commons/utils/services';
import { SystemVersionService } from './commons/versions/system-version.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);

  const configsMain = {
    port: Number(configService.get<number>('API_PORT')),
    urlAutorizadaCors: configService.get<string>('URL_AUTORIZADA_CORS'),
    environment: configService.get<string>('ENVIRONMENT'),
  };

  if (configsMain.environment !== 'production') {
    Swagger.setup(app);
  }

  app.enableCors({
    origin: configsMain.urlAutorizadaCors,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  SystemVersionService.setup(app);
  HealthCheckService.setup(app, '/ping');

  await app.listen(configsMain.port, async () => {
    Logger.debug(`API disponível em: ${ServicesUtils.getLocalIp()}:${configsMain.port}`);
  });
}
bootstrap();
