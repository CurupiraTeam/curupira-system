import { Module } from '@nestjs/common';
import { RelatosService } from './relatos.service';
import { RelatosController } from './relatos.controller';
import { PrismaModule } from 'src/commons/databases/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [RelatosController],
  providers: [RelatosService],
})
export class RelatosModule {}
