# spec-2-plan-done.md — Spec 2 · S1 Hero

**Data:** 2026-06-25
**Fase:** Plan concluída
**Próxima fase:** Implement

---

## Arquivos Permitidos na fase Implement

O agente de implementação só pode criar ou modificar os arquivos listados abaixo.
**Nenhum outro arquivo deve ser tocado.**

| Arquivo | Ação |
|---------|------|
| `src/components/sections/S1Hero/index.tsx` | Substituir integralmente (placeholder → componente completo) |

---

## Componente Final — Código Completo

Substituir **integralmente** `src/components/sections/S1Hero/index.tsx` pelo seguinte:

```tsx
import { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { PresentationContext } from '../../../App'
import logoGI from '../../../assets/logo-gi-group.png'
import logoPerformIT from '../../../assets/logo-perform-it.svg'

interface Metric {
  value: number
  suffix: string
  label: string
}

interface MetricCounterProps {
  metric: Metric
}

const METRICS: Metric[] = [
  { value: 5,  suffix: ' dias',        label: 'de design sprint' },
  { value: 3,  suffix: ' jornadas',    label: 'mapeadas end-to-end' },
  { value: 17, suffix: ' iniciativas', label: 'estruturadas e priorizadas' },
]

function useCountUp(target: number, duration = 800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let current = 0
    const increment = target / (duration / 16)
    let raf: number
    function tick() {
      current = Math.min(current + increment, target)
      setCount(Math.round(current))
      if (current < target) {
        raf = requestAnimationFrame(tick)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return count
}

function MetricCounter({ metric }: MetricCounterProps) {
  const count = useCountUp(metric.value)
  return (
    <div className="flex flex-col items-center px-10 py-6 border-r border-white/20 last:border-r-0">
      <div className="text-5xl font-bold text-white">
        {count}
        <span className="text-2xl text-gi-comet ml-1">{metric.suffix}</span>
      </div>
      <div className="text-sm text-gi-stardust mt-2">{metric.label}</div>
    </div>
  )
}

function S1Hero() {
  const { next } = useContext(PresentationContext)

  return (
    <motion.div
      className="min-h-screen bg-gi-navy flex flex-col items-center justify-center px-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-8 mb-14">
        <img src={logoGI} alt="GI Group" className="h-10 object-contain" />
        <div className="w-px h-8 bg-white/30" />
        <img src={logoPerformIT} alt="Perform IT" className="h-8 object-contain" />
      </div>

      <div className="text-center mb-12 max-w-3xl">
        <h1 className="text-5xl font-bold text-white leading-tight mb-4">
          Centralização CARE & SMS<br />Jornada do Worker
        </h1>
        <p className="text-xl text-gi-stardust">
          Diagnóstico sistêmico e propostas de transformação digital
        </p>
        <p className="text-sm text-gi-crater mt-3">
          Junho 2026 · v1.0 · Perform IT
        </p>
      </div>

      <div className="flex items-stretch bg-white/5 border border-white/10 rounded-xl mb-12">
        {METRICS.map((metric) => (
          <MetricCounter key={metric.label} metric={metric} />
        ))}
      </div>

      <button
        onClick={next}
        className="flex items-center gap-2 px-6 py-3 bg-gi-blue text-white rounded-lg font-bold hover:bg-white hover:text-gi-navy transition-colors duration-200"
      >
        Iniciar a leitura
        <ChevronRight size={18} />
      </button>
    </motion.div>
  )
}

export default S1Hero
```

---

## Decisões técnicas do plano

### CTA — `next()` em vez de `goTo(1)`

O research-done especificou `goTo(1)` assumindo que S2Diagnóstico estaria no step 1. Com o Galaxy Layout redesign (2026-06-23), a ordem dos SECTIONS mudou e S2Diagnóstico está no index 6. O CTA usa `presentation.next()` — navega para o step 1 (Dores), que é o próximo planeta na ordem horária. Esta é a decisão correta para o Galaxy Layout.

### SVG import — fallback

Se o Vite levantar erro de TypeScript no import `.svg`, adicionar `?url`:
```ts
import logoPerformIT from '../../../assets/logo-perform-it.svg?url'
```

### `useCountUp` — hook local

RAF-based, sem dependência nova. Duration de 800ms: para value=17 → ~800ms com incrementos suaves; para value=5 e value=3 → 5 e 3 passos discretos visíveis ao longo de 800ms. Hook não é extraído para `src/hooks/` porque nenhuma outra seção usa contador animado.

### Métricas — constantes locais

Os valores `5 / 3 / 17` são constantes de apresentação, não dados de domínio. Ficam como `METRICS` no próprio arquivo — não vão para `src/data/`.

---

## Verificações obrigatórias antes do commit

- [ ] `npx tsc --noEmit` → 0 erros
- [ ] `npm run build` → dist/ gerado sem erros
- [ ] Visual: todos os 7 elementos do Hero renderizam corretamente em viewport ≥ 1280px
  - Logo GI + separador + Logo Perform IT
  - Título em duas linhas (text-5xl bold branco)
  - Subtítulo (text-xl gi-stardust)
  - Linha de data/versão (text-sm gi-crater)
  - 3 cards de métrica com contador animado
  - Botão CTA "Iniciar a leitura" (gi-blue)
- [ ] CTA `next()` navega para o próximo módulo (Dores)
- [ ] Contadores animam de 0 ao valor-alvo a cada mount
- [ ] Animação fadeInUp de entrada da seção funciona (400ms)
- [ ] Navegar para o Galaxy e voltar → contadores re-animam do zero

---

## Comando de commit

```bash
git add src/components/sections/S1Hero/index.tsx
git commit -m "feat: implement S1Hero — logos, animated metrics, title block, CTA"
```

---

## Após o Implement

O agente de implementação deve gerar `.agent/specs/spec-2-implement-done.md` ao concluir.
O humano então atualiza `PROJECT-STATE.md` com o status da Spec 2.
