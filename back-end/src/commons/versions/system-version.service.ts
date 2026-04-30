import { INestApplication, Logger } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { Marked } from 'marked';
import { join } from 'path';

export class SystemVersionService {
  private static readonly logger = new Logger(SystemVersionService.name);

  public static setup(app: INestApplication, routePath: string = '/versoes'): void {
    const httpAdapter = app.getHttpAdapter();
    const instance = httpAdapter.getInstance();

    instance.get(routePath, async (req, res) => {
      try {
        const content = await SystemVersionService.getChangelogContent();
        const html = await SystemVersionService.renderHtml(content);
        
        res.header('Content-Type', 'text/html');
        res.send(html);
      } catch (error) {
        SystemVersionService.logger.error(`Erro ao renderizar changelog: ${error.message}`);
        res.status(500).send('<h1>Erro interno</h1><p>Não foi possível carregar as notas de versão.</p>');
      }
    });

    SystemVersionService.logger.log(`Rota de versões configurada em: ${routePath}`);
  }

  private static async getChangelogContent(): Promise<string> {
    const possiblePaths = [
      join(process.cwd(), 'src', 'CHANGELOG.md'),  // Caminho em Prod (Docker/Build)
      join(process.cwd(), 'dist', 'CHANGELOG.md'), // Caminho alternativo de build
      join(process.cwd(), 'CHANGELOG.md'),         // Caminho em Dev (Raiz)
    ];

    for (const path of possiblePaths) {
      try {
        return await readFile(path, 'utf-8');
      } catch (e) {
        // Continua tentando o próximo caminho
      }
    }
    throw new Error('Arquivo CHANGELOG.md não encontrado em nenhum dos caminhos esperados.');
  }

  private static async renderHtml(markdown: string): Promise<string> {
    let h2Count = 0;
    const renderer = {
      heading(this: any, { tokens, depth }: any) {
        const text = this.parser.parseInline(tokens);
        const escapedText = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/^-+|-+$/g, '');

        if (depth === 1) {
          return `<h1 id="changelog-header">${text}</h1>`;
        }

        if (depth === 2) {
          h2Count++;
          if (h2Count === 1) {
            return `<h2 id="latest-version">${text}</h2>`;
          }
        }

        return `<h${depth} id="${escapedText}">${text}</h${depth}>`;
      },
    };

    const markedInstance = new Marked({ renderer });
    const htmlContent = await markedInstance.parse(markdown);

    const colors = {
        bgMain: '#0d1117',
        bgContainer: '#161b22',
        textPrimary: '#c9d1d9',
        textSecondary: '#8b949e',
        border: '#30363d',
        accentVersion: '#238636',
        accentScope: '#e3b341',
        link: '#58a6ff',
        codeBg: 'rgba(110,118,129,0.4)',
        headerBg: '#21262d'
    };

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notas de Versão</title>
        <style>
          body {
            margin: 0;
            padding: 40px 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            background-color: ${colors.bgMain};
            color: ${colors.textPrimary};
            line-height: 1.6;
          }

          .container {
            max-width: 900px;
            margin: 0 auto;
            background-color: ${colors.bgContainer};
            border: 1px solid ${colors.border};
            border-radius: 8px;
            padding: 40px; /* Espaçamento interno geral */
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            overflow: hidden; /* Garante que o H1 não vaze as bordas arredondadas */
          }

          /* --- TÍTULO PRINCIPAL (H1 - # Changelog) --- */
          /* O truque da Margem Negativa para criar o Banner */
          h1 {
            background-color: ${colors.headerBg};
            color: #fff;
            margin: -40px -40px 30px -40px; /* Estica para cobrir o padding do pai */
            padding: 30px 40px;
            border-bottom: 1px solid ${colors.border};
            font-size: 2rem;
            letter-spacing: -1px;
          }

          /* Texto de descrição logo abaixo do H1 */
          p {
            margin-bottom: 1.2rem;
            color: ${colors.textSecondary};
          }

          /* --- VERSÕES (H2 - ## 1.0.0) --- */
          h2 {
            margin-top: 3.5rem;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid ${colors.border};
            color: #fff;
            font-size: 1.6rem;
          }
          /* Link dentro do H2 (a data/versão geralmente é um link) */
          h2 a {
             color: ${colors.accentVersion};
             text-decoration: none;
          }
          h2 a:hover { text-decoration: underline; }

          /* --- TIPO DE MUDANÇA (H3 - ### Features/Bug Fixes) --- */
          h3 {
            margin-top: 2rem;
            color: ${colors.accentScope};
            text-transform: uppercase;
            font-size: 0.95rem;
            letter-spacing: 1.2px;
            font-weight: 700;
          }

          /* --- LISTAS DE COMMITS --- */
          ul {
            padding-left: 1.2rem;
            list-style-type: none; /* Remove bolinha padrão */
          }
          li {
            margin-bottom: 10px;
            position: relative;
            padding-left: 15px;
          }
          /* Bolinha customizada */
          li::before {
            content: "•";
            color: ${colors.border}; 
            position: absolute;
            left: -10px;
            font-weight: bold;
          }
          
          /* Links (Hash do commit) */
          a {
            color: ${colors.link};
            text-decoration: none;
            transition: color 0.2s;
          }
          a:hover {
            color: #79c0ff;
            text-decoration: underline;
          }

          /* Código Inline */
          code {
            background-color: ${colors.codeBg};
            padding: 0.2em 0.4em;
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, monospace;
            font-size: 85%;
          }

          /* Estilo para Scrollbar (Chrome/Edge/Safari) */
          ::-webkit-scrollbar { width: 10px; }
          ::-webkit-scrollbar-track { background: ${colors.bgMain}; }
          ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 5px; }
          ::-webkit-scrollbar-thumb:hover { background: #555; }
        </style>
      </head>
      <body>
        <div class="container">
          ${htmlContent}
        </div>
      </body>
      </html>
    `;
  }
}