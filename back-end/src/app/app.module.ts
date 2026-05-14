import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Environment } from 'src/commons/configs/env/env.config';
import { configValidationSchema } from 'src/commons/configs/env/env.validation';
import { JwtAuthGuard } from 'src/commons/guards/jwt-autenticacao.guard';
import { LoggerInterceptor } from 'src/commons/interceptors/logger.interceptor';
import { ResponseInterceptor } from 'src/commons/interceptors/response.interceptor';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpExceptionFilter } from 'src/commons/filters/httpExceptionFilter';
import { ExternalsModule } from 'src/externals/externals.module';
import { ExampleModule } from './example/example.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArduinoService } from '../arduino/arduino.service';
import { ArduinoGateway } from 'src/arduino/arduino.gateway';
import { CategoriasModule } from './categorias/categorias.module';
import { RelatosModule } from './relatos/relatos.module';
import { HealthModule } from './health/health.module';
import { SensoresModule } from './sensores/sensores.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: Environment.get(),
      validationSchema: configValidationSchema,
    }),
    EventEmitterModule.forRoot(),
    ExternalsModule,
    ExampleModule,
    AuthModule,
    UsersModule,
    CategoriasModule,
    RelatosModule,
    HealthModule,
    SensoresModule,
  ],
  controllers: [],
  providers: [
    ArduinoService,
    ArduinoGateway,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
