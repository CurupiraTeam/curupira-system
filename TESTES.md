# Testes — Curupira System

Documentação dos testes automatizados de **back-end** e **front-end**: 5 testes unitários e 5 testes de integração em cada lado.

---

## Back-end (NestJS + Jest)

Framework já configurado no `back-end/package.json` (Jest + ts-jest + `@nestjs/testing` + Supertest). O `testRegex` é `.*\.spec\.ts$`, então tanto os `.spec.ts` (unitários) quanto os `.integration.spec.ts` (integração) são executados.

### Como rodar

```bash
cd back-end
npm install        # caso ainda não tenha as dependências
npm test           # roda todos os testes
npm run test:cov   # com cobertura
```

### Testes unitários (services isolados, Prisma mockado)

| # | Arquivo | O que valida |
|---|---------|--------------|
| 1 | `src/app/auth/auth.service.spec.ts` | `validateUser` retorna o usuário sem a senha quando as credenciais batem |
| 2 | `src/app/auth/auth.service.spec.ts` | `validateUser` retorna `null` com senha incorreta / `login` assina o JWT |
| 3 | `src/app/users/users.service.spec.ts` | `create` lança `ConflictException` quando o e-mail já existe |
| 4 | `src/app/users/users.service.spec.ts` | `create` persiste a senha criptografada (hash bcrypt, não texto puro) |
| 5 | `src/app/sensores/sensores.service.spec.ts` | `getMetricas` calcula o AQI corretamente e usa valor base sem leituras |

> Casos extras unitários em `src/app/relatos/relatos.service.spec.ts` (resolução de slug de categoria e filtro por bounding box).

### Testes de integração (controller + service reais via Supertest)

Apenas a camada de banco (`PrismaService`) é mockada; o restante (controllers, pipes de validação, JWT) roda de verdade.

| # | Arquivo | Endpoint / cenário |
|---|---------|--------------------|
| 1 | `src/app/auth/auth.integration.spec.ts` | `POST /auth/login` retorna `access_token` (JWT) com credenciais válidas |
| 2 | `src/app/auth/auth.integration.spec.ts` | `POST /auth/login` retorna `401` com senha inválida |
| 3 | `src/app/auth/auth.integration.spec.ts` | `POST /auth/cadastro` retorna `400` com e-mail inválido (ValidationPipe) |
| 4 | `src/app/sensores/sensores.integration.spec.ts` | `GET /sensores/metricas` retorna `pm25`, `aqiValue` e métricas adicionais |
| 5 | `src/app/relatos/relatos.integration.spec.ts` | `GET /relatos` retorna lista unificada normalizada e ordenada por data |

---

## Front-end (React + Vitest + Testing Library)

O front não possuía runner de testes; foi adicionado **Vitest** com **@testing-library/react** e ambiente **jsdom**.

### Configuração adicionada

- `vitest.config.ts` — ambiente jsdom, globals e `setupFiles`.
- `src/test/setup.ts` — importa `@testing-library/jest-dom` e faz `cleanup` após cada teste.
- `package.json` — scripts `test` / `test:watch` e devDependencies (`vitest`, `@testing-library/*`, `jsdom`).

### Como rodar

```bash
cd front-end
npm install        # instala as novas dependências de teste
npm test           # roda todos os testes uma vez
npm run test:watch # modo interativo
```

### Testes unitários (funções/serviços puros)

| # | Arquivo | O que valida |
|---|---------|--------------|
| 1 | `src/utils/status.test.ts` | `getStatusByIqa` mapeia faixas de IQA (Bom/Moderado/Ruim/Crítico) |
| 2 | `src/utils/tokenStorage.test.ts` | armazenar, recuperar e limpar o token no `localStorage` |
| 3 | `src/utils/normalizeApiError.test.ts` | normalização de erros da API (401, array de mensagens, 500, erro de rede) |
| 4 | `src/services/auth.service.test.ts` | `AuthService.login` extrai o token (aninhado/raiz) e lança erro sem token |

> O arquivo de `status` cobre 5 asserções (faixas + estilos), e o de `normalizeApiError` cobre 4 cenários.

### Testes de integração (componentes/hooks com Testing Library)

| # | Arquivo | Cenário |
|---|---------|---------|
| 1 | `src/components/auth/ProtectedRoute.test.tsx` | redireciona para `/login` sem token (Router + AuthProvider) |
| 2 | `src/components/auth/ProtectedRoute.test.tsx` | renderiza o conteúdo protegido quando há token |
| 3 | `src/hooks/useAuth.test.tsx` | `login` autentica e extrai o usuário do JWT |
| 4 | `src/hooks/useAuth.test.tsx` | `logout` limpa token e usuário |
| 5 | `src/hooks/useAuth.test.tsx` | `loginAsDemo` autentica com usuário de demonstração |

> Estes testes integram vários módulos reais (hook `useAuth` + `AuthService` + `tokenStorage` + parsing de JWT + React Router); apenas o `httpClient` (camada de rede) é mockado.

---

## Resumo

| Camada | Unitários | Integração |
|--------|-----------|------------|
| Back-end | 5 | 5 |
| Front-end | 5 | 5 |
