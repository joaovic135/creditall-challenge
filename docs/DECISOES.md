# Decisões do Projeto

Documento de tomada de decisões arquiteturais e de design. Para solicitar a explicação detalhada.

---

## 1. API em `/api/item` (não `/item`)

**Decisão:** Endpoints REST em `app/api/` seguindo convenção Next.js.

**Por quê:** Padrão do App Router; separa rotas de API das páginas; URLs como `/api/item` são claras e previsíveis.

---

## 2. Services em `services/` (não `lib/`)

**Decisão:** Lógica de negócio e acesso a dados em `services/`.

**Por quê:** `lib/` para utilitários e clientes; `services/` para regras de negócio e orquestração. Separação de responsabilidades.

---

## 3. MySQL com Prisma

**Decisão:** Banco relacional MySQL, ORM Prisma.

**Por quê:** Requisito de banco relacional; Prisma oferece tipagem, migrations e DX; MySQL amplamente usado em produção.

---

## 4. Vitest para testes

**Decisão:** Vitest em vez de Jest.

**Por quê:** Recomendação do Next.js; integração com Vite; suporte a ESM; boa performance.

---

## 5. Testes colocalizados

**Decisão:** `*.test.ts` ao lado dos arquivos testados.

**Por quê:** Facilita manutenção; deixa claro o que cada arquivo testa; evita pastas de teste separadas.

---

## 6. Cobertura no CI

**Decisão:** `npm run test:coverage` no GitHub Actions.

**Por quê:** Garantir que testes rodem com cobertura em todo push; visibilidade da qualidade do código.

---

## 7. Testes antes do build

**Decisão:** `npm run test:run && next build` no script de build.

**Por quê:** Evitar deploy de código com testes falhando; Vercel só faz deploy se os testes passarem.

---

## 8. Padrão BFF nos Route Handlers

**Decisão:** Route Handlers seguindo Backend-for-Frontend.

**Por quê:** Lógica fora do frontend; transformação e agregação no servidor; alinhado à documentação Next.js.

---

## 9. Erros genéricos ao cliente

**Decisão:** Resposta `"Unexpected error"` em erros 500.

**Por quê:** Não expor detalhes internos; reduz risco de vazamento de informações sensíveis.

---

## 10. Rules locais (ignoradas pelo git)

**Decisão:** `.cursor/rules/` no `.gitignore`.

**Por quê:** Regras pessoais do desenvolvedor; não versionadas para não afetar o time.
