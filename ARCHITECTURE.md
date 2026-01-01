# Arquitetura e Boas Práticas

Documentação da arquitetura do projeto e decisões técnicas seguindo as melhores práticas de desenvolvimento.

## Estrutura do Projeto

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (protected)/        # Rotas protegidas por autenticação
│   │   │   ├── admin/          # Painel administrativo
│   │   │   └── layout.tsx      # Layout com proteção de rota
│   │   ├── admin/
│   │   │   └── login/          # Página de login
│   │   ├── api/                # API Routes
│   │   │   ├── admin/layout/   # Endpoint de configuração de layout
│   │   │   └── auth/login/     # Endpoint de autenticação
│   │   ├── [...slug]/          # Páginas dinâmicas (artigos)
│   │   ├── layout.tsx          # Layout raiz
│   │   └── page.tsx            # Homepage
│   │
│   ├── components/             # Componentes reutilizáveis
│   │   ├── ui-native/          # Componentes UI nativos (sem shadcn)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── toast.tsx
│   │   ├── layouts/            # Layouts da homepage
│   │   │   ├── layout-a.tsx    # Layout estilo Política
│   │   │   └── layout-b.tsx    # Layout estilo Economia
│   │   ├── article-page.tsx    # Componente de artigo
│   │   ├── header.tsx          # Header global
│   │   ├── pagination.tsx      # Paginação
│   │   └── search-bar.tsx      # Barra de busca
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── use-layout-preference.ts  # Hook para preferência de layout
│   │   └── use-query-param.ts        # Hook para query params (substitui nuqs)
│   │
│   ├── lib/                    # Utilitários e lógica de negócio
│   │   ├── api.ts              # Camada de API com caching
│   │   ├── auth.ts             # Lógica de autenticação
│   │   ├── cookies-client.ts   # Helpers de cookies (client)
│   │   ├── cookies-server.ts   # Helpers de cookies (server)
│   │   ├── types.ts            # Tipos TypeScript
│   │   └── utils.ts            # Funções utilitárias
│   │
│   └── index.css               # Estilos globais e variáveis CSS
│
├── next.config.ts              # Configuração do Next.js
├── tsconfig.json               # Configuração TypeScript
└── package.json                # Dependências do projeto
```

## Padrões de Projeto Aplicados

### 1. Component-Based Architecture

**Organização por Responsabilidade**:
- **UI Components** (`ui-native/`): Componentes reutilizáveis e agnósticos
- **Feature Components**: Componentes específicos de funcionalidades
- **Layout Components**: Estruturas de página

**Exemplo**:
```tsx
// Componente UI genérico
export const Button = ({ variant, size, ...props }) => { ... }

// Componente de feature
export function SearchBar() {
  const [query, setQuery] = useQueryParam("search");
  // ... lógica específica
}
```

### 2. Separation of Concerns

**Camadas Distintas**:
- **Presentation** (`components/`): Apenas UI e interação
- **Business Logic** (`lib/`): Lógica de negócio e transformações
- **Data Layer** (`lib/api.ts`): Comunicação com API e caching

**Exemplo**:
```typescript
// Data Layer (api.ts)
export async function fetchPosts(params) { ... }

// Business Logic (hooks/use-layout-preference.ts)
export function useLayoutPreference() { ... }

// Presentation (components/admin/page.tsx)
export default function AdminPage() {
  const { layout, updateLayout } = useLayoutPreference();
  // ... apenas rendering
}
```

### 3. Dependency Inversion

**Abstrações sobre Implementações**:
```typescript
// Interface abstrata
export interface FetchPostsParams {
  per_page?: number;
  category?: string;
  // ...
}

// Implementação concreta
export async function fetchPosts(params: FetchPostsParams) { ... }
```

### 4. Single Responsibility Principle

**Cada arquivo tem uma única responsabilidade**:
- `api.ts`: Apenas comunicação com API
- `auth.ts`: Apenas autenticação
- `cookies-server.ts`: Apenas manipulação de cookies server-side

### 5. DRY (Don't Repeat Yourself)

**Reutilização de Código**:
```typescript
// Hook reutilizável para query params
export function useQueryParam(key: string) { ... }

// Usado em múltiplos componentes
const [search] = useQueryParam("search");  // SearchBar
const [page] = useQueryParam("page");      // Pagination
```

## Decisões Técnicas

### 1. Sem Bibliotecas Proibidas

**Removido**:
- ❌ shadcn/ui → ✅ Componentes nativos em `ui-native/`
- ❌ Axios → ✅ Native `fetch` com `unstable_cache`
- ❌ TanStack Query → ✅ Caching nativo do Next.js
- ❌ nuqs → ✅ Hook customizado `useQueryParam`

**Justificativa**: Demonstrar capacidade de desenvolvimento sem dependências externas.

### 2. Server Components First

**Estratégia**:
- Máximo de Server Components
- Client Components apenas quando necessário (< 15% do código)
- "use client" explícito e justificado

**Benefícios**:
- SEO otimizado
- Menor bundle JavaScript
- Melhor performance inicial

### 3. TypeScript Strict Mode

**Configuração**:
```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "verbatimModuleSyntax": true
}
```

**Benefícios**:
- Type safety completo
- Menos bugs em runtime
- Melhor DX com autocomplete

### 4. Monorepo com Workspaces

**Estrutura**:
```
apps/
  web/           # Aplicação Next.js
packages/
  config/        # Configuração TypeScript compartilhada
  env/           # Validação de variáveis de ambiente
```

**Benefícios**:
- Código compartilhado
- Configuração centralizada
- Facilita manutenção

## Tratamento de Erros

### Níveis de Tratamento

**1. API Layer**:
```typescript
try {
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`API Error: ${response.status}`);
    return fallbackValue;
  }
} catch (error) {
  console.error("Network Error:", error);
  return fallbackValue;
}
```

**2. Component Layer**:
```tsx
{posts.length === 0 ? (
  <EmptyState message="Nenhum resultado encontrado" />
) : (
  <PostList posts={posts} />
)}
```

**3. Route Layer**:
```tsx
// not-found.tsx
export default function NotFound() {
  return <NotFoundPage />;
}
```

### Graceful Degradation

**Princípio**: A aplicação deve sempre funcionar, mesmo com falhas parciais.

**Exemplo**:
```typescript
// Se imagem não carregar, mostra placeholder
<Image
  src={post.featured_image?.url ?? "/placeholder.jpg"}
  alt={post.title}
  onError={(e) => {
    e.currentTarget.src = "/placeholder.jpg";
  }}
/>
```

## Reusabilidade

### 1. Custom Hooks

**Hooks Criados**:
- `useLayoutPreference()`: Gerenciamento de preferência de layout
- `useQueryParam()`: Manipulação de URL query params

**Exemplo de Reutilização**:
```tsx
// Em SearchBar
const [search, setSearch] = useQueryParam("search");

// Em Pagination
const [page, setPage] = useQueryParam("page");

// Em SearchResults
const [filter, setFilter] = useQueryParam("filter");
```

### 2. Componentes Genéricos

**Componentes UI Reutilizáveis**:
```tsx
// Button com variantes
<Button variant="primary">Salvar</Button>
<Button variant="outline">Cancelar</Button>

// Card reutilizável
<Card>
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### 3. Funções Utilitárias

```typescript
// lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usado em todos os componentes
className={cn("base-styles", conditionalStyles, className)}
```

## Legibilidade e Manutenibilidade

### 1. Naming Conventions

**Consistência**:
- Componentes: PascalCase (`SearchBar`, `AdminPage`)
- Funções: camelCase (`fetchPosts`, `updateLayout`)
- Constantes: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Tipos: PascalCase (`Post`, `LayoutType`)

### 2. Comentários Úteis

**Documentação de Código**:
```typescript
/**
 * Fetch posts from CNN Brasil API with intelligent caching
 * Uses Next.js unstable_cache for optimal performance and revalidation
 */
export async function fetchPosts(params: FetchPostsParams = {}) { ... }
```

### 3. Organização de Imports

**Ordem Consistente**:
```typescript
// 1. React e Next.js
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. Bibliotecas externas
import { clsx } from "clsx";

// 3. Componentes locais
import { Button } from "@/components/ui-native/button";

// 4. Hooks e utils
import { useLayoutPreference } from "@/hooks/use-layout-preference";

// 5. Tipos
import type { LayoutType } from "@/lib/types";
```

## Segurança

### 1. Autenticação Simples e Segura

```typescript
// Backend validation
if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
  return { error: "Invalid credentials" };
}

// Token generation
const token = randomBytes(32).toString("hex");

// Protected routes
if (!isAuthenticated()) {
  router.push("/admin/login");
}
```

### 2. Variáveis de Ambiente

```typescript
// Validação com Zod
export const env = createEnv({
  server: {
    ADMIN_USERNAME: z.string().default("admin"),
    ADMIN_PASSWORD: z.string().default("admin123"),
  },
  // ...
});
```

### 3. Sanitização de Dados

```typescript
// Normalização de dados da API
function normalizePost(cnnPost: CNNPost): Post {
  return {
    id: Number.parseInt(cnnPost.id, 10),
    slug: cnnPost.slug,
    // ... validação e transformação
  };
}
```

## Conclusão

O projeto foi desenvolvido seguindo rigorosamente as melhores práticas de:
- ✅ Código limpo e legível
- ✅ Arquitetura escalável
- ✅ Performance otimizada
- ✅ Tratamento de erros robusto
- ✅ Reusabilidade de componentes
- ✅ Type safety com TypeScript
- ✅ Mínimas dependências externas
