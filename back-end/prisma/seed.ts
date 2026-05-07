import { PrismaClient, PapelUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de banco de dados...');

  const categorias = [
    { nome: 'Fumaça', icone_url: '/icons/fumaca.png' },
    { nome: 'Queimada', icone_url: '/icons/queimada.png' },
    { nome: 'Cheiro Forte Químico', icone_url: '/icons/quimico.png' },
  ];

  for (const cat of categorias) {
    await prisma.categoriaRelato.upsert({
      where: { nome: cat.nome },
      update: {},
      create: cat,
    });
  }
  console.log('Categorias iniciais inseridas.');

  const emailAdmin = 'admin@curupira.com';
  const salt = await bcrypt.genSalt();
  const senhaHash = await bcrypt.hash('admin123', salt);

  const admin = await prisma.usuario.upsert({
    where: { email: emailAdmin },
    update: {
      senha: senhaHash,
    },
    create: {
      nome: 'Administrador Curupira',
      email: emailAdmin,
      senha: senhaHash,
      papel: PapelUsuario.ADMIN,
    },
  });

  console.log(`Usuário admin garantido: ${admin.email}`);
  console.log('Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar o seed:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
