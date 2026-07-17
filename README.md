# Avocato

> **Live deploy:** [avocato-inky.vercel.app](https://avocato-inky.vercel.app)

Plataforma web para gestionar hábitos alimenticios saludables. Permite calcular el IMC, el peso ideal y el gasto calórico diario, analizar comidas con IA y recibir recomendaciones nutricionales personalizadas a través de una experiencia visual inspirada en la alimentación mediterránea.

> **Proyecto piloto** creado para testear agentes de IA y skills con [OpenCode](https://opencode.ai). El objetivo es evaluar cómo un agente puede comprender, mantener y mejorar un proyecto real de front-end moderno.

## Screenshots

La app incluye 4 vistas principales:

- **Dashboard** — Anillo de calorías con progreso visual, macro nutrientes, registro de comidas del día
- **Buscar** — Búsqueda de alimentos contra la API pública de Open Food Facts
- **Perfil** — Formulario de datos personales para calcular metas calóricas (Mifflin-St Jeor)
- **Consejos** — Tips de bienestar aleatorios

## Stack

| Capa | Tecnología |
|------|------------|
| Lenguaje | TypeScript estricto |
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Runtime / Build | Vite 8 |
| Estado | Pinia (persistencia en `localStorage`) |
| Estilos | Tailwind CSS v4 (configuración vía CSS) |
| Enrutado | Vue Router (lazy-loaded) |
| Datos | Fetch Nativo → Open Food Facts API |
| Tests | Vitest + @vue/test-utils |
| Linting | ESLint 9 (flat config) + Prettier |
| Iconos | Font Awesome Free |

## Por qué existe este proyecto

Avocato es un **proyecto piloto** para experimentar con:

1. **Agentes de código** — Evaluar si un agente de IA puede navegar, comprender y modificar un codebase real sin cometer errores.
2. **Skills de OpenCode** — Probar skills como `frontend-design`, `vue`, `tailwind-css-patterns`, `vitest`, entre otros, en un contexto práctico.
3. **Convenciones de proyecto** — Verificar si un agente respeta paletas de color, arquitectura de componentes, y reglas de negocio preexistentes.

El repositorio incluye un archivo `AGENTS.md` con instrucciones específicas para agentes de IA que trabajen en el proyecto.

## Arquitectura

```
src/
├── design-system/             # Design System
│   ├── tokens/index.css       # Design tokens (colors, spacing, typography, etc.)
│   └── index.ts               # Barrel export de todos los componentes Ds*
├── components/
│   ├── ui/                    # Primitivos UI del Design System
│   │   ├── Button.vue         # Variantes: primary/secondary/ghost/danger/accent
│   │   ├── Input.vue          # Label, helper, error, tamaños sm/md/lg
│   │   ├── Card.vue           # Variantes: default/elevated/warm/surface
│   │   ├── Badge.vue          # Variantes: primary/accent/success/warning/danger/info
│   │   ├── Modal.vue          # Teleport, tamaños sm/md/lg/xl, backdrop blur
│   │   └── Typography.vue     # Variantes: display/h1-h4/body/label/caption
│   ├── layout/                # Componentes de layout
│   │   ├── Container.vue      # Max-width responsive + padding
│   │   ├── Stack.vue          # Flex direction + gap + align + justify
│   │   └── Grid.vue           # CSS Grid responsive con minItemWidth
│   ├── forms/                 # Componentes de formulario
│   │   └── Field.vue          # Wrapper con label/error/helper
│   ├── state/                 # Componentes de estado
│   │   ├── EmptyState.vue     # Estado vacío con icono + action slot
│   │   ├── Loading.vue        # Spinner animado con tamaños
│   │   └── ErrorState.vue     # Error con retry
│   ├── AppHeader.vue          # Navbar sticky con hamburger menu
│   ├── CalorieRing.vue        # Anillo SVG de progreso calórico
│   ├── FoodCard.vue           # Tarjeta de alimento con Nutri-Score badge
│   └── NutrientCard.vue       # Barra de progreso por macro nutriente
├── hooks/                     # Hooks reutilizables
│   ├── useModal.ts            # Estado open/close/toggle
│   ├── useDebounce.ts         # Debounce genérico con cleanup
│   └── index.ts               # Barrel export
├── composables/               # Composables para lógica reactiva
│   ├── useFoodSearch.ts       # Search state, debounce, performSearch
│   ├── useAddFood.ts          # Modal state, openAddModal, confirmAdd
│   └── useTip.ts              # Fetch tip, loading/error state
├── views/                     # Vistas principales (todas lazy-loaded)
│   ├── DashboardView.vue
│   ├── ProfileView.vue
│   ├── SearchView.vue
│   └── TipsView.vue
├── stores/                    # Almacenes Pinia con persistencia localStorage
│   ├── userStore.ts           # Perfil de usuario + metas calóricas
│   └── foodStore.ts           # Registro de comidas del día
├── services/                  # Clientes HTTP
│   ├── openFoodFacts.ts       # API pública de Open Food Facts
│   └── tipsService.ts         # API de consejos + fallback local
├── types/                     # Definiciones TypeScript
│   ├── user.ts
│   └── food.ts
├── utils/                     # Funciones puras y constantes
│   ├── mifflinStJeor.ts       # Fórmula Mifflin-St Jeor (TMB/TDEE)
│   ├── nutrition.ts           # calcPercentage, groupEntriesByMealType, sumServings
│   ├── formatting.ts          # formatDateEs, formatCalorieEntry
│   └── constants.ts           # MEAL_TYPE_OPTIONS, ACTIVITY_OPTIONS, GOAL_OPTIONS
├── router/index.ts            # Vue Router
├── style.css                  # Tailwind v4 + design tokens import
└── main.ts                    # Entry point
```

## Arquitectura interna

### Separación de responsabilidades

El código está organizado en capas claras:

- **Design System** (`src/design-system/`) — Tokens de diseño y barrel export de todos los componentes reutilizables.
- **Utils** (`src/utils/`) — Funciones puras sin dependencias de Vue. Calculan, transforman y formatean datos. Testables de forma aislada.
- **Hooks** (`src/hooks/`) — Hooks reutilizables (useModal, useDebounce).
- **Composables** (`src/composables/`) — Lógica reactiva extraída de componentes. Manejan estado, efectos secundarios y orquestación.
- **Stores** (`src/stores/`) — Estado global persistido. Solo manejan datos del usuario y registros de comida.
- **Services** (`src/services/`) — Clientes HTTP puros. Solo hacen fetch y transforman la respuesta de APIs externas.
- **UI Components** (`src/components/ui/`) — Primitivos del design system: Button, Input, Card, Badge, Modal, Typography.
- **Layout** (`src/components/layout/`) — Container, Stack, Grid para layouts reutilizables.
- **Forms** (`src/components/forms/`) — Field wrapper para formularios.
- **State** (`src/components/state/`) — EmptyState, Loading, ErrorState.
- **Business Components** (`src/components/`) — AppHeader, CalorieRing, FoodCard, NutrientCard. Componen primitivos UI + lógica de negocio.

### Design system

Los tokens de diseño están centralizados en `src/design-system/tokens/index.css` como CSS custom properties:

- **Colores**: `--clr-primary` (olive), `--clr-accent` (terracotta), `--clr-secondary` (mustard), `--clr-bg` (cream)
- **Superficies**: `--clr-surface`, `--clr-surface-alt`, `--clr-surface-muted`
- **Texto**: `--clr-text`, `--clr-text-muted`, `--clr-text-faint`, `--clr-text-inverse`
- **Semánticos**: `--clr-success`, `--clr-warning`, `--clr-danger`, `--clr-info` (+ light variants)
- **Bordes**: `--clr-border`, `--clr-border-subtle`, `--clr-border-strong`
- **Spacing**: `--space-0` a `--space-24` (escala 4px)
- **Radios**: `--radius-xs` (4px) a `--radius-full` (9999px)
- **Sombras**: `--shadow-xs` a `--shadow-xl` + `--shadow-inner`
- **Tipografía**: `--font-display` (DM Sans), `--font-body` (Source Sans 3), `--font-mono`
- **Animación**: `--duration-*`, `--ease-*`
- **Z-index**: `--z-base` (0) a `--z-tooltip` (600)
- **Opacidad**: `--opacity-disabled`, `--opacity-hover`, `--opacity-muted`, `--opacity-faint`

Los componentes UI (`Button`, `Input`, `Card`, `Badge`, `Modal`, `Typography`) encapsulan estilos scoped y consumen estos tokens. Las clases legacy (`.btn`, `.input-field`, `.card`, `.card-elevated`) se mantienen para compatibilidad con vistas existentes.

## Datos y persistencia

- **Sin backend** — toda la app corre en el navegador
- **localStorage** bajo prefijo `avocato-` para persistir perfil y registros diarios
- **APIs públicas** sin autenticación: Open Food Facts (alimentos) y Advice Slip (consejos)

## Diseño visual

- **Paleta**: olive green (`#5b7a3d`), terracotta (`#c4704b`), mustard (`#d4a843`), cream (`#faf5eb`)
- **Tipografía**: DM Sans (display/headings) + Source Sans 3 (body) vía Google Fonts
- **Elemento signature**: CalorieRing con efecto de glow SVG
- **Transiciones**: page transitions entre rutas, hover micro-interactions
- **Responsive**: mobile-first, funciona desde 320px, hamburger menu en mobile

## Getting started

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con Vite |
| `npm run build` | Type-check (`vue-tsc -b`) + build de producción |
| `npm run preview` | Preview del build de producción |
| `npm run test:unit` | Ejecutar tests unitarios (Vitest) |
| `npm run test:watch` | Tests en watch mode |
| `npm run lint` | ESLint + Prettier auto-fix |
| `npm run format` | Solo Prettier (sin ESLint) |

## Skills instaladas

Este proyecto tiene las siguientes skills de OpenCode configuradas en `skills-lock.json`:

| Skill | Fuente | Uso |
|-------|--------|-----|
| `frontend-design` | anthropics/skills | Guía de diseño visual distintivo |
| `vue` | antfu/skills | Mejores prácticas Vue 3 |
| `vue-best-practices` | antfu/skills | Patrones de código Vue |
| `vue-pinia-best-practices` | vuejs-ai/skills | Uso correcto de Pinia |
| `tailwind-css-patterns` | giuseppe-trisciuoglio/developer-kit | Patrones Tailwind |
| `vite` | antfu/skills | Configuración y optimización Vite |
| `vitest` | antfu/skills | Testing con Vitest |
| `typescript-advanced-types` | wshobson/agents | Tipos avanzados TypeScript |
| `seo` | addyosmani/web-quality-skills | Optimización SEO |
| `accessibility` | addyosmani/web-quality-skills | Accesibilidad web |
| `nodejs-backend-patterns` | wshobson/agents | Patrones backend Node.js |
| `nodejs-best-practices` | sickn33/antigravity-awesome-skills | Mejores prácticas Node.js |
| `vue-debug-guides` | hyf0/vue-skills | Debugging Vue |

## Notas para agentes de IA

Si estás trabajando en este proyecto como agente, lee `AGENTS.md` para instrucciones específicas. Puntos clave:

- **Tailwind v4**: No existe `tailwind.config.js`. La configuración está en `src/style.css` con `@theme`, los tokens en `src/design-system/tokens/index.css`.
- **Alias `@`**: Mapea a `./src`. Usa `@/components/...` en imports.
- **Design System**: Usar componentes `Ds*` desde `src/design-system/index.ts` (Button, Input, Card, Badge, Modal, Typography, Container, Stack, Grid, Field, EmptyState, Loading, ErrorState).
- **Tests**: Unit tests en `src/utils/` para funciones puras (30 tests con Vitest).
- **Prettier**: Sin punto y coma, comillas simples, 100 caracteres de ancho.
- **Composables**: La lógica reactiva va en `src/composables/`, no en los componentes directamente.

## Licencia

Proyecto privado — creado para fines de experimentación con agentes de IA.
