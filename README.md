# AURA — Landing Page

Landing page editorial com um objeto 3D que percorre a página conforme o scroll (inspirada na Stereoscope Coffee).

**Stack:** React 19 · Vite · Three.js + React Three Fiber/Drei · GSAP ScrollTrigger · Lenis · Tailwind CSS v4

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera /dist
```

## Trocar o produto

Todo o conteúdo vem de `src/data/product.json`. O layout não precisa ser alterado:

| Campo | Efeito |
| --- | --- |
| `name`, `brand`, `price`, `collection` | Nav, rodapé fixo e seção final |
| `colors` | `[papel, tinta]` — fundo/texto da página e cores do material 3D |
| `modelPath` | Caminho de um `.glb` (ex.: `/models/bottle.glb` em `public/`). `null` usa a garrafa procedural |
| `hero.headline` | Uma linha por item; a partir da 2ª linha o texto é deslocado (assimetria) |
| `sections[]` | Uma tela por item. `align: "left" \| "right"` posiciona o texto; o objeto 3D vai para o lado oposto |
| `cta` | Botão e nota da seção final |

Modelos `.glb` são centralizados e normalizados automaticamente para a mesma altura. Comprima com Draco antes de publicar:

```bash
npx gltf-pipeline -i bottle.glb -o public/models/bottle.glb -d
```

## Como a coreografia funciona

- `src/lib/choreography.js` gera uma pose (posição, rotação, escala) por seção a partir de `sections[].align`.
- Uma única timeline GSAP com `scrub` percorre essas poses; como cada seção tem exatamente 100svh, o segmento *i* da timeline corresponde ao scroll entre a seção *i* e *i+1*.
- A timeline escreve num objeto mutável (`pose`) que o loop do R3F lê a cada frame — sem re-render do React.
- Por cima disso: flutuação constante (`Float`) e inclinação suave seguindo o mouse (lerp).
- Lenis é dirigido pelo ticker do GSAP, mantendo ScrollTrigger sincronizado. Com `prefers-reduced-motion`, Lenis e a flutuação são desativados.
- Em telas retrato o objeto ocupa a metade de cima e o texto vai para baixo, preservando a legibilidade.
- A iluminação de estúdio usa `Lightformer`s (sem download de HDR).

## Publicar no GitHub Pages

```bash
npm run deploy   # build + push de dist/ para o branch gh-pages
```

Página: https://thiagodobronx.github.io/ — em *Settings → Pages*, a fonte deve ser o branch `gh-pages`, pasta `/ (root)`.
