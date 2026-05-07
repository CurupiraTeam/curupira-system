# 📜 Padrões de Git do Projeto

Este documento unifica todas as regras de versionamento garantidas automaticamente pelo **Husky**.
Siga estas diretrizes para evitar bloqueios durante o desenvolvimento.

## 📑 Sumário
1. [Padrão de Branches](#1--padrão-de-branches)
    - [Regra de Origem](#11-regra-de-ouro-origem)
    - [Estrutura do Nome](#12-estrutura-obrigatória-do-nome)
    - [Exemplos](#13-exemplos-práticos-branches)
2. [Padrão de Commits](#2--padrão-de-commits)
    - [Estrutura](#21-estrutura-obrigatória)
    - [Tipos Aceitos](#22-tipos-aceitos-types)
    - [Escopos](#23-escopos-aceitos-scopes)
    - [Exemplos](#24-exemplos-práticos-commits)

---

## 1. 🌿 Padrão de Branches

### 1.1 Regra de Ouro (Origem)
⚠️ **Toda nova branch DEVE nascer a partir da `main`.**
O sistema bloqueará tentativas de criar branches a partir de outras branches (como `feat/xxx`).

**Como fazer corretamente:**
```bash
git checkout main
git pull
git checkout -b <nome-da-nova-branch>
```

### 1.2 Estrutura Obrigatória do Nome
O formato deve ser **sempre em letras minúsculas** e separado por barras `/`:

`[desenvolvedor]/[tipo]/[descricao-curta]`

#### Componentes:
1. **Desenvolvedor**: Identificador do dev (ex: `lucas`, `joao`).
2. **Tipo**: O tipo da tarefa (feat, fix, chore, etc).
3. **Descrição**: Breve descrição usando hífens (ex: `nova-tela`).

### 1.3 Exemplos Práticos (Branches)

| Status | Branch | Motivo |
| :--- | :--- | :--- |
| ✅ **Certo** | `lucas/feat/login-page` | Segue o padrão perfeito. |
| ✅ **Certo** | `pedro/fix/erro-calculo` | Correção bem identificada. |
| ❌ **Errado** | `minha-branch` | Falta estrutura completa. |
| ❌ **Errado** | `feat/login` | Falta nome do desenvolvedor. |
| ❌ **Errado** | `Lucas/Feat/Login` | Letras maiúsculas proibidas. |

---

## 2. 📏 Padrão de Commits

Utilizamos **Conventional Commits**. Mensagens fora do padrão serão rejeitadas.

### 2.1 Estrutura Obrigatória
`git commit -m "tipo(escopo): descrição em minusculo"`

### 2.2 Tipos Aceitos (Types)

| Tipo | Descrição | Versão (SemVer) |
| :--- | :--- | :--- |
| **feat** | Nova funcionalidade | 🚀 MINOR |
| **fix** | Correção de bug | 🐛 PATCH |
| **chore** | Config/Build/Ferramentas | ➖ N/A |
| **docs** | Documentação | ➖ N/A |
| **style** | Formatação (espaços, ; ) | ➖ N/A |
| **refactor** | Melhoria sem alterar lógica | ➖ N/A |
| **perf** | Melhoria de performance | ➖ N/A |
| **test** | Testes | ➖ N/A |

### 2.3 Escopos Aceitos (Scopes)
- **(front)**: Angular (`/frontend`)
- **(back)**: NestJS (`/backend`)
- **(repo)**: Raiz, configurações (`/`)
- **(shared)**: Compartilhado

### 2.4 Exemplos Práticos (Commits)

| Status | Commit |
| :--- | :--- |
| ✅ **Certo** | `feat(front): implementa dashboard` |
| ✅ **Certo** | `fix(back): corrige validacao jwt` |
| ❌ **Errado** | `feat: botão login` (Falta escopo) |
| ❌ **Errado** | `Feat(Front): Login` (Maiúsculas proibidas) |
| ❌ **Errado** | `corrigindo bug` (Formato inválido) |
