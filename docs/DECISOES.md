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

## 10. React Hook Form + Zod no frontend

**Decisão:** Formulários com `react-hook-form` e `@hookform/resolvers/zod`.

**Por quê:** Validação declarativa; integração nativa com Zod; menos re-renders; boa DX.

---

## 11. Schema Zod compartilhado

**Decisão:** Schemas em `lib/schemas/` usados no frontend e backend.

**Por quê:** Uma única fonte de verdade; tipagem e validação consistentes; evita duplicação de regras.

---

## 12. Validação Zod no backend

**Decisão:** Route Handlers validam body com `schema.safeParse()` antes de chamar services.

**Por quê:** Garantir dados corretos na entrada; mensagens de erro padronizadas; rejeitar payloads inválidos cedo.

---

## 13. SOLID e Clean Code no frontend

**Decisão:** Princípios SOLID e Clean Code aplicados em `app/`.

**Por quê:** Código mais manutenível; responsabilidades claras; componentes e hooks reutilizáveis; keys estáveis em listas.

---

## 14. Hooks em `hooks/`

**Decisão:** Custom hooks em `app/<rota>/hooks/` (ex: `useProducts`, `useCreateProduct`, `useItemPage`).

**Por quê:** Lógica separada da UI; hooks pequenos e focados; orquestração em hooks de página.

---

## 15. API client no frontend

**Decisão:** Camada `app/<rota>/api/` com funções de fetch (ex: `fetchProducts`, `postProduct`).

**Por quê:** Inversão de dependência; facilita testes e troca de implementação; encapsula URLs e headers.

---

## 16. Componentes extraídos

**Decisão:** Componentes pequenos e focados: `ProductCard`, `ProductForm`, `LoadingState`, `ErrorState`.

**Por quê:** Single Responsibility; reutilização; páginas mais legíveis; testes mais simples.

---

## 17. Zod v4 e API de erro

**Decisão:** Uso de `error: (issue) => string` em vez de `invalid_type_error` / `required_error`.

**Por quê:** Zod v4 removeu esses parâmetros; API unificada com `error`; mensagens customizadas por tipo de issue.

---

## 18. Tailwind Variants no frontend

**Decisão:** Componentes com estilos Tailwind usam `tailwind-variants` (`tv`) para variantes, slots e composição de classes.

**Por quê:** Variantes tipadas; resolução de conflitos com tailwind-merge; código mais declarativo e manutenível.

---

## 19. Componentes e páginas com pasta própria

**Decisão:** Cada componente e página tem pasta `Nome/index.tsx` e `Nome/styles.ts`. Estilos em `styles.ts` com `export const styles = tv()`.

**Por quê:** Colocation de estilos com o componente; `styles.root()`, `styles.input()` etc.; evolução isolada por componente.

---

## 20. ShadCN UI para componentes

**Decisão:** Componentes de UI usam ShadCN (Button, Input, Label, Card) em `components/ui/`.

**Por quê:** Design system consistente; acessibilidade; tema com variáveis CSS; componentes no projeto.

---
