import { Controller, Get, Post, Body, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { RelatosService } from './relatos.service';

@ApiTags('Relatos')
@Controller('relatos')
export class RelatosController {
  constructor(private readonly relatosService: RelatosService) {}

  @Post('usuarios')
  @UseInterceptors(FileInterceptor('foto'))
  async createUsuarioRelato(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    const usuarioId = body.usuario_id;
    if (!usuarioId) {
      throw new Error("usuario_id é obrigatório para o relato");
    }
    return this.relatosService.createUsuarioRelato(usuarioId, body, file);
  }

  @Post('oficiais')
  async createOficialRelato(@Body() body: any) {
    return this.relatosService.createOficialRelato(body);
  }

  @Get()
  @ApiQuery({ name: 'latMin', required: false, type: String })
  @ApiQuery({ name: 'latMax', required: false, type: String })
  @ApiQuery({ name: 'lngMin', required: false, type: String })
  @ApiQuery({ name: 'lngMax', required: false, type: String })
  async findAllUnified(
    @Query('latMin') latMin?: string,
    @Query('latMax') latMax?: string,
    @Query('lngMin') lngMin?: string,
    @Query('lngMax') lngMax?: string,
  ) {
    return this.relatosService.findAllUnified({ latMin, latMax, lngMin, lngMax });
  }
}
