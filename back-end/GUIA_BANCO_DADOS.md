# Guia do Banco de Dados (Prisma + Docker)

Este guia define o fluxo de trabalho para manter o banco de dados sincronizado entre todos os membros da equipe Curupira.

## 🚀 Configuração Inicial

Antes de começar, garanta que você tem o Docker e o Node.js instalados.

1.  **Subir os Bancos (Postgres e Redis):**
    ```bash
    npm run db:up
    ```
2.  **Sincronizar Banco e Gerar Tipagens:**
    ```bash
    npm install
    npx prisma migrate dev
    ```
    *Este comando aplicará todas as migrações existentes e criará o usuário admin padrão (seed).*

---

## 🛠️ Como criar novas tabelas ou alterar colunas

Sempre que precisar mudar a estrutura do banco, siga estes passos:

1.  **Edite o arquivo:** `prisma/schema.prisma`.
2.  **Gere a migração:** No terminal, rode:
    ```bash
    npx prisma migrate dev --name <descricao_da_mudanca>
    ```
    *Exemplo: `npx prisma migrate dev --name adiciona_campo_telefone_usuario`*
3.  **Commit:** Envie para o Git o arquivo `schema.prisma` **E** a nova pasta gerada em `prisma/migrations`.

---

## 📥 Como pegar alterações de colegas

Sempre que você der um `git pull` e houver mudanças no banco:

1.  **Sincronize seu banco local:**
    ```bash
    npx prisma migrate dev
    ```
    *O Prisma detectará as migrations novas que seus colegas fizeram e as aplicará no seu banco local.*

---

## ⚠️ Regras de Ouro

1.  **NUNCA** delete ou edite arquivos dentro da pasta `prisma/migrations` que já foram enviados para o Git. Se algo estiver errado, crie uma **nova** migration corrigindo.
2.  **NUNCA** envie seu arquivo `.env` para o Git. Ele contém senhas locais. Use o `.env.example` como base.
3.  **NUNCA** rode `prisma db push` em ambiente de desenvolvimento compartilhado, pois isso pula o sistema de migrations e pode quebrar o banco dos colegas. Use sempre `prisma migrate dev`.

---

## 🐘 Visualizando os dados

Para ver os dados inseridos de forma visual (interface gráfica):
```bash
npx prisma studio
```
*Isso abrirá um gerenciador de banco de dados no seu navegador em `http://localhost:5555`.*
