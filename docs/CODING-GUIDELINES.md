# CODING-GUIDELINES.md — GI Group · Portal do Worker

**Versão:** 1.0
**Status:** Em desenvolvimento

---

## 1. Visão Geral

Este documento define as convenções de código, padrões de implementação e regras proibidas para o relatório interativo GI Group. Todo código gerado deve seguir estas diretrizes sem exceção.

Em caso de dúvida sobre como implementar algo não coberto aqui, perguntar antes de assumir.

---

## 2. Linguagem e Tipagem

- TypeScript em todos os arquivos — nenhum arquivo `.js` no projeto.
- Proibido o uso de `any`. Usar `unknown` quando o tipo não for conhecido e tratar antes de usar.
- Toda prop de componente React deve ter interface explícita.
- Preferir `interface` para objetos e `type` para unions, enums e aliases.
- Tipos e interfaces compartilhados ficam em `src/types/index.ts`.
- Tipos locais a um componente podem ser declarados no próprio arquivo, acima do componente.

```typescript
// Correto
interface IniciativaCardProps {
  iniciativa: Iniciativa
  onSelect: (id: string) => void
}

type FilterPersona = 'todos' | Persona

// Proibido
const IniciativaCard = (props: any) => { ... }
```

---

## 3. Nomenclatura

| Elemento                  | Convenção                   | Exemplo                        |
| ------------------------- | --------------------------- | ------------------------------ |
| Componentes React         | PascalCase                  | `IniciativaCard`               |
| Hooks React               | camelCase com prefixo `use` | `useActiveSection`             |
| Funções utilitárias       | camelCase                   | `formatImpacto`                |
| Types e Interfaces        | PascalCase                  | `Iniciativa`, `DorCardProps`   |
| Constantes de dados       | UPPER_SNAKE_CASE            | `INICIATIVAS`, `SISTEMAS`      |
| Variáveis e funções       | camelCase                   | `activeSection`, `handleClick` |
| Arquivos de componente    | PascalCase                  | `IniciativaCard.tsx`           |
| Arquivos de hook          | camelCase                   | `useActiveSection.ts`          |
| Arquivos de dados         | camelCase                   | `iniciativas.ts`               |
| Arquivos de tipos         | camelCase                   | `index.ts`                     |
| Seções do relatório       | prefixo `S` + número + nome | `S2Diagnostico/`               |
| IDs de seção              | kebab-case                  | `'diagnostico-sistemico'`      |

---

## 4. Estrutura de Componentes

O projeto segue uma arquitetura em três camadas: **dados → hooks → componentes**.

### 4.1 Camadas e Responsabilidades

- `src/data/` — constantes estáticas. Sem lógica, sem estado. Apenas exporta arrays e objetos tipados.
- `src/hooks/` — encapsulam todo estado, derivações e lógica de navegação. Importam de `src/data/` e `src/types/`. Sem JSX.
- `src/components/` — apenas renderização. Sem estado além de micro-interações de UI (hover, open/close). Importam de `src/hooks/` e `src/types/`.

### 4.2 Ordem interna de componentes

Todo componente deve seguir esta ordem:

1. Imports
2. Interface de props (se não estiver em `types/`)
3. Constantes locais (se houver)
4. Definição do componente
5. Return do JSX
6. Export default

```typescript
// 1. Imports
import { useState } from 'react'
import { Badge } from '../ui/Badge'
import type { Iniciativa } from '../../types'

// 2. Interface de props
interface IniciativaCardProps {
  iniciativa: Iniciativa
  isSelected: boolean
  onSelect: (id: string) => void
}

// 4. Componente
function IniciativaCard({ iniciativa, isSelected, onSelect }: IniciativaCardProps) {
  // 5. Return
  return (
    <div
      className={`rounded-xl border p-6 cursor-pointer transition-all ${
        isSelected ? 'border-gi-blue border-2' : 'border-gi-border hover:border-gi-blue'
      }`}
      onClick={() => onSelect(iniciativa.id)}
    >
      <Badge variant={iniciativa.jornada}>{iniciativa.jornada}</Badge>
      <h3 className="text-base font-bold text-gi-dark mt-3">{iniciativa.titulo}</h3>
    </div>
  )
}

// 6. Export
export default IniciativaCard
```

### 4.3 Componentes de seção

Cada seção do relatório fica em sua própria pasta dentro de `src/components/sections/`. A pasta contém:

- `index.tsx` — componente principal da seção (default export)
- Subcomponentes específicos da seção (se necessário)

```
src/components/sections/
├── S2Diagnostico/
│   ├── index.tsx          # Componente principal
│   ├── SistemaCard.tsx    # Subcomponente específico
│   └── MapaSistemas.tsx   # Subcomponente específico
```

---

## 5. Estilização

- Usar **Tailwind CSS** como único sistema de estilização.
- Proibido CSS inline (`style={{}}`), exceto em casos de valores dinâmicos impossíveis de expressar via Tailwind (ex: altura calculada em JS).
- Proibido arquivos `.css` adicionais além de `src/index.css` (que contém apenas as diretivas Tailwind e os tokens globais).
- Cores, tipografia e espaçamentos sempre via tokens do `tailwind.config.ts` — nunca valores hex hard-coded em className.
- Classes condicionais sempre via template string ou biblioteca `clsx`/`cn`.

```typescript
// Correto
<div className={`rounded-xl p-6 ${isActive ? 'bg-gi-blue text-white' : 'bg-white text-gi-dark'}`}>

// Também correto (clsx)
<div className={cn('rounded-xl p-6', isActive && 'bg-gi-blue text-white', !isActive && 'bg-white')}>

// Proibido
<div style={{ backgroundColor: '#1D57FB', padding: '24px', borderRadius: '12px' }}>

// Proibido (hex hard-coded em className via arbitrary value desnecessário)
<div className="bg-[#1D57FB]">   // usar bg-gi-blue
```

---

## 6. Gerenciamento de Estado

- `useState` é o mecanismo padrão de estado local.
- Estado compartilhado entre seções vai em hooks customizados e, se necessário, em Context.
- Proibido prop drilling com mais de dois níveis — criar Context ou reestruturar.
- O Context de apresentação (`PresentationContext`) é o único Context global do projeto.
- Dados estáticos (`INICIATIVAS`, `SISTEMAS`, etc.) são importados diretamente — não entram em estado.

```typescript
// Correto — estado local para micro-interação
function SistemaCard({ sistema }: SistemaCardProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  // ...
}

// Correto — estado compartilhado no hook
function useActiveSection() {
  const [activeId, setActiveId] = useState<string>('hero')
  // ...
  return { activeId, setActiveId }
}

// Proibido — dado estático em estado desnecessário
const [iniciativas, setIniciativas] = useState(INICIATIVAS) // INICIATIVAS é imutável
```

---

## 7. Animações

- Usar **Framer Motion** para todas as animações — proibido CSS transitions longas ou `@keyframes` custom.
- Animações de entrada de seção: máximo 400ms, `fadeInUp` padrão.
- Animações de micro-interação (hover, tooltip): máximo 200ms.
- Proibido animações que bloqueiem leitura ou ação do usuário.
- Usar `AnimatePresence` para elementos que entram e saem do DOM.

```typescript
// Correto
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  ...
</motion.div>
```

---

## 8. Dados Estáticos

- Todos os dados do relatório ficam em `src/data/` como constantes TypeScript.
- Cada arquivo exporta uma ou mais constantes nomeadas em UPPER_SNAKE_CASE.
- Os dados devem ser totalmente tipados com as interfaces de `src/types/index.ts`.
- Proibido dados hard-coded dentro de componentes.

```typescript
// Correto — src/data/iniciativas.ts
import type { Iniciativa } from '../types'

export const INICIATIVAS: Iniciativa[] = [
  {
    id: 'I01',
    titulo: 'Portal de admissão com rastreio em tempo real',
    // ...
  },
]

// Proibido — dado dentro do componente
function S5Iniciativas() {
  const iniciativas = [
    { id: 'I01', titulo: '...' }, // proibido
  ]
}
```

---

## 9. Comentários

Comentários devem ser usados apenas quando a lógica for genuinamente não óbvia e não puder ser tornada clara por renomeação.

- Proibido comentários que descrevem o que o código faz.
- Permitido comentários explicando o **porquê** de uma decisão não óbvia.

```typescript
// Proibido — descreve o que o código faz
// Filtra iniciativas por jornada
const filtered = INICIATIVAS.filter(i => i.jornada === activeJornada)

// Permitido — explica o porquê
// IntersectionObserver com threshold 0.3 porque seções longas
// nunca chegam a 50% de visibilidade na viewport de 1080p
const observer = new IntersectionObserver(callback, { threshold: 0.3 })
```

---

## 10. Proibições Gerais

| Proibido                                          | Motivo                                              |
| ------------------------------------------------- | --------------------------------------------------- |
| `any`                                             | Quebra a segurança de tipos                         |
| CSS inline (`style={{}}`) para valores estáticos  | Viola o padrão Tailwind                             |
| Valores hex hard-coded em className               | Usar tokens do design system                        |
| Prop drilling com mais de 2 níveis                | Reestruturar com Context                            |
| Dados hard-coded dentro de componentes            | Extrair para `src/data/`                            |
| Animações com duration > 500ms                    | Prejudica a fluidez da apresentação                 |
| Comentários auto-explicativos                     | O código deve ser auto-explicativo                  |
| Arquivos `.css` adicionais além de `index.css`    | Tudo via Tailwind                                   |
| Fetch ou chamadas de API                          | Projeto é 100% estático                             |
| `localStorage` ou `sessionStorage`               | Estado em memória apenas                            |

---

## 11. Referências

- Arquitetura: `ARCHITECTURE.md`
- Design system: `DESIGN-SYSTEM.md`
- Contexto de negócio: `CONTEXT.md`
- Estado do projeto: `PROJECT-STATE.md`
- Specs funcionais: `SPECS.md`
