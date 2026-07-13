# spec-4-research-done.md — S3 Dores por Persona

**Spec:** 4 — S3 Dores por Persona
**Fase:** Research concluída
**Data:** 2026-06-25
**Executado por:** Agente Research (Claude)

---

## 1. Objetivo da Spec

Implementar a seção S3 do relatório interativo com as 11 dores identificadas no design sprint,
organizadas por persona, filtráveis, com cards expandíveis mostrando a iniciativa que resolve
cada dor. Fundo `gi-light`, identidade visual GI Group.

---

## 2. Estado do Projeto Antes da Implementação

| Item | Estado |
|------|--------|
| Spec 3 (S2 Diagnóstico) | ✅ Concluída |
| Placeholder `S3Dores/index.tsx` | Stub mínimo (título + bg-gi-light) |
| Dados `src/data/dores.ts` | ✅ Populado — 11 dores D01–D11 |
| Tipos `src/types/index.ts` | ✅ Interface `Dor` completa |
| Dados `src/data/iniciativas.ts` | ✅ Populado — 17 iniciativas I01–I17 |

---

## 3. Mapeamento dos Dados

### 3.1 Interface `Dor` (src/types/index.ts)

```typescript
interface Dor {
  id: string                        // 'D01'–'D11'
  titulo: string                    // título curto da dor
  descricao: string                 // descrição completa
  personas: Persona[]               // 1 ou 2 personas
  jornada: Jornada                  // 'admissao' | 'ciclo-ativo' | 'offboarding'
  severidade: 'critica' | 'alta' | 'media'
  iniciativaQueResolve: string      // ID da iniciativa (ex: 'I01')
}
```

**Nenhuma alteração de tipo necessária.**

### 3.2 Distribuição das 11 dores por persona

| Persona | IDs | Quantidade |
|---------|-----|-----------|
| Worker | D01, D02, D05, D06, D07, D09, D11 | 7 |
| Colaborador GI | D03, D04, D05, D08, D10 | 5 |
| Cliente | D06 | 1 |
| Total único | D01–D11 | 11 |

> D05 pertence a Worker + Colaborador GI. D06 pertence a Worker + Cliente.
> O filtro deve usar `dor.personas.includes(filterPersona)`.

### 3.3 Distribuição por jornada

| Jornada | IDs | Quantidade |
|---------|-----|-----------|
| Admissão | D01, D02, D03, D04 | 4 |
| Ciclo Ativo | D05, D06, D07, D08 | 4 |
| Offboarding | D09, D10, D11 | 3 |

### 3.4 Mapeamento jornada → Badge variant

| Jornada | BadgeVariant |
|---------|--------------|
| `admissao` | `'admissao'` |
| `ciclo-ativo` | `'ciclo'` |
| `offboarding` | `'offboarding'` |

**Todos os variants necessários já existem em `Badge.tsx`.**

### 3.5 Mapeamento severidade → Badge variant

| Severidade | BadgeVariant |
|-----------|--------------|
| `critica` | `'critica'` |
| `alta` | `'alta'` |
| `media` | `'media'` |

**Todos os variants necessários já existem em `Badge.tsx`.**

---

## 4. Componentes a Criar

### 4.1 Estrutura de pastas

```
src/components/sections/S3Dores/
├── index.tsx          # Substituir stub — componente principal da seção
├── DorCard.tsx        # Criar — card individual com expansão
└── DoresList.tsx      # Criar — filtros + contador + lista com stagger
```

### 4.2 `DorCard.tsx`

**Props:**
```typescript
interface DorCardProps {
  dor: Dor
  isExpanded: boolean
  onToggle: (id: string) => void
}
```

**Conteúdo do card (estado fechado):**
- Badge de severidade (esquerda superior)
- Badge de jornada (direita superior)
- Título da dor (`text-base font-bold text-gi-dark`)
- Tags de persona (`Tag` component para cada persona)
- Indicador visual de "clique para expandir" (ícone ChevronDown/Up de lucide-react)

**Conteúdo do painel expandido (AnimatePresence):**
- Descrição completa da dor (`text-sm text-gi-text`)
- Separador horizontal
- Label "Iniciativa que resolve:" + nome completo da iniciativa buscada em `INICIATIVAS`

**Comportamento:**
- Clique em qualquer parte do card chama `onToggle(dor.id)`
- Card fechado: `Card variant="hoverable"`
- Card expandido: `Card variant="highlighted"` (borda azul elétrico)
- Painel expandido: `AnimatePresence` com `motion.div` (height de 0 a auto, opacity 0→1, 300ms)

**Lookup de iniciativa:**
```typescript
import { INICIATIVAS } from '../../../data/iniciativas'
const iniciativa = INICIATIVAS.find(i => i.id === dor.iniciativaQueResolve)
```

### 4.3 `DoresList.tsx`

**Estado local:**
```typescript
const [activeFilter, setActiveFilter] = useState<FilterPersona>('todos')
const [expandedId, setExpandedId] = useState<string | null>(null)
```

**Tipo local:**
```typescript
type FilterPersona = 'todos' | Persona
```

**Filtros de persona:**
- Botões: Todos / Worker / Colaborador GI / Cliente
- Cada botão exibe o contador de dores: "Worker (7)"
- Estilo ativo: `bg-gi-navy text-white border-gi-navy` (igual ao padrão S2)
- Estilo inativo: `bg-white text-gi-charcoal border-gi-border hover:border-gi-navy hover:text-gi-navy`
- As cores de persona (purple para Worker, blue para Colaborador GI, teal para Cliente) **não** são aplicadas nos botões de filtro — usar o padrão neutro do S2

**Lógica de filtro:**
```typescript
const doresFiltradas = activeFilter === 'todos'
  ? DORES
  : DORES.filter(d => d.personas.includes(activeFilter))
```

**Toggle do card:**
```typescript
function handleToggle(id: string) {
  setExpandedId(prev => prev === id ? null : id)
}
```

**Grid de cards:**
- Layout: `grid grid-cols-1 gap-4` (lista vertical — dores são longas, não colunas)
- Stagger: containerVariants + cardVariants (mesmo padrão do S2)

**Animação de re-filtro:**
- `AnimatePresence mode="popLayout"` no grid para cards que entram/saem ao filtrar

### 4.4 `index.tsx` (substituição do stub)

Estrutura:
```tsx
<div className="min-h-screen bg-gi-light py-20 px-12">
  <motion.div variants={sectionVariants} initial="hidden" animate="visible">
    <h2 className="text-4xl font-bold text-gi-navy">Dores por Persona</h2>
    <p className="text-xl text-gi-text mt-3 mb-12">
      11 dores identificadas no design sprint — organizadas por quem sofre
    </p>
    <DoresList />
  </motion.div>
</div>
```

---

## 5. Componentes Reutilizáveis do Design System

| Componente | Uso na S3 |
|-----------|-----------|
| `Badge` | Severidade (critica/alta/media) + Jornada (admissao/ciclo/offboarding) |
| `Card` | Base do DorCard (variant hoverable → highlighted quando expandido) |
| `Tag` | Tags de persona dentro do card |
| `motion` (Framer Motion) | Stagger, animação de entrada, AnimatePresence para expansão |
| `ChevronDown` / `ChevronUp` (lucide-react) | Indicador de expansão no card |

**Nenhum componente de UI novo precisa ser criado.**

---

## 6. Dependências Externas

Todas já instaladas no projeto:
- `framer-motion` — animações e AnimatePresence
- `lucide-react` — ícones ChevronDown/Up

---

## 7. Risco Identificado: Conflito Framer Motion / Tailwind

O mesmo conflito documentado na Spec 3 pode ocorrer aqui se a animação de expansão do painel usar classes Tailwind para altura. **Mitigação:** usar `motion.div` com `initial={{ height: 0, opacity: 0 }}` / `animate={{ height: 'auto', opacity: 1 }}` diretamente no estilo Framer Motion — sem classes Tailwind para controle de altura do painel expandido.

---

## 8. Arquivos Permitidos na Implementação

| Arquivo | Ação |
|---------|------|
| `src/components/sections/S3Dores/index.tsx` | Modificar (substituir stub) |
| `src/components/sections/S3Dores/DorCard.tsx` | Criar |
| `src/components/sections/S3Dores/DoresList.tsx` | Criar |

**Nenhum outro arquivo deve ser modificado.**
- `src/data/dores.ts` → não tocar (dados já completos)
- `src/types/index.ts` → não tocar (interface Dor já completa)
- `src/data/iniciativas.ts` → não tocar (apenas leitura via import)

---

## 9. Critérios de Aceite (da Spec)

| # | Critério |
|---|---------|
| 1 | Todas as 11 dores mapeadas com dados corretos |
| 2 | Filtro por persona funcional |
| 3 | Card expandível mostra iniciativa que resolve a dor |
| 4 | Badges de severidade visualmente distintos |
| 5 | Badges de jornada no card |
| 6 | Animação de entrada dos cards (stagger) |

---

## 10. Pendências / Decisões a Confirmar

Nenhuma. Todos os dados, tipos, componentes atômicos e padrões necessários estão disponíveis.
O plano pode ser elaborado diretamente com base neste research.
