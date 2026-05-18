import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/databases/prisma.service';

@Injectable()
export class RelatosService {
  constructor(private readonly prisma: PrismaService) {}

  async createUsuarioRelato(usuarioId: string, data: any, file?: Express.Multer.File) {
    // Robust resolution of categoria_id to support both numeric and text slug formats
    let categoriaId = 1;
    if (data.categoria_id) {
      const parsed = parseInt(data.categoria_id, 10);
      if (!isNaN(parsed)) {
        categoriaId = parsed;
      } else {
        const slug = String(data.categoria_id).toLowerCase().trim();
        if (slug === 'fumaca' || slug === 'fumaça') {
          categoriaId = 1;
        } else if (slug === 'queimada') {
          categoriaId = 2;
        } else if (slug === 'cheiro-forte-quimico' || slug === 'quimico') {
          categoriaId = 3;
        }
      }
    }

    const relato = await this.prisma.relatoUsuario.create({
      data: {
        usuario: { connect: { id: usuarioId } },
        categoria: { connect: { id: categoriaId } },
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0,
        descricao: data.descricao || null,
        referencia_endereco: data.referencia_endereco || null,
      },
    });

    if (file) {
      await this.prisma.midiaRelato.create({
        data: {
          url: `/uploads/${file.filename}`,
          relato_usuario: { connect: { id: relato.id } },
        },
      });
    }

    return relato;
  }

  async createOficialRelato(data: any) {
    return this.prisma.relatoOficial.create({
      data: {
        fonte: data.fonte,
        id_externo: data.id_externo,
        categoria_id: data.categoria_id ? parseInt(data.categoria_id) : 1,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        metadados: data.metadados,
        detectado_em: data.detectado_em ? new Date(data.detectado_em) : new Date(),
      },
    });
  }

  async findAllUnified(filters: { latMin?: string; latMax?: string; lngMin?: string; lngMax?: string }) {
    const usuariosRaw = await this.prisma.relatoUsuario.findMany({
      include: {
        categoria: true,
      },
    });

    const oficiaisRaw = await this.prisma.relatoOficial.findMany({
      include: {
        categoria: true,
      },
    });

    const usuarios = usuariosRaw.map((r) => ({
      id: r.id,
      city: 'Manaus', // Fixo para MVP
      neighborhood: r.referencia_endereco || 'Desconhecido',
      type: r.categoria?.nome || 'Outro',
      status: r.status === 'ATIVO' ? 'Ruim' : 'Bom',
      source: 'Usuário',
      intensity: 50,
      createdAt: r.criado_em.toISOString(),
      description: r.descricao,
      lat: r.latitude,
      lng: r.longitude,
    }));

    const oficiais = oficiaisRaw.map((r) => ({
      id: r.id,
      city: 'Manaus',
      neighborhood: 'Desconhecido', 
      type: r.categoria?.nome || 'Outro',
      status: 'Crítico',
      source: r.fonte || 'Estação oficial',
      intensity: 80,
      createdAt: r.detectado_em.toISOString(),
      description: 'Alerta oficial detectado',
      lat: r.latitude,
      lng: r.longitude,
    }));

    let combined = [...usuarios, ...oficiais];

    if (filters.latMin && filters.latMax && filters.lngMin && filters.lngMax) {
      const minLat = parseFloat(filters.latMin);
      const maxLat = parseFloat(filters.latMax);
      const minLng = parseFloat(filters.lngMin);
      const maxLng = parseFloat(filters.lngMax);

      combined = combined.filter(
        (c) => c.lat >= minLat && c.lat <= maxLat && c.lng >= minLng && c.lng <= maxLng
      );
    }

    return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
