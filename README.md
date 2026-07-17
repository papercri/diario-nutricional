# Avocato

> **Live deploy:** [avocato-inky.vercel.app](https://avocato-inky.vercel.app)

Plataforma web para gestionar hábitos alimenticios saludables. Permite calcular el IMC, el peso ideal y el gasto calórico diario, analizar comidas con IA y recibir recomendaciones nutricionales personalizadas a través de una experiencia visual inspirada en la alimentación mediterránea.

> **Proyecto piloto** creado para testear agentes de IA y skills con [OpenCode](https://opencode.ai). El objetivo es evaluar cómo un agente puede comprender, mantener y mejorar un proyecto real de front-end moderno.

## Screenshots

La app incluye 4 vistas principales:

- **Dashboard** — Anillo de calorías con progreso visual, macro nutrientes, registro de comidas del día
- **Buscar** — Búsqueda de alimentos contra la API pública de Open Food Facts
- **Analizar** — Analizador de comidas potenciado por IA
- **Perfil** — Formulario de datos personales, calculadora de IMC con gauge lineal, metas calóricas (Mifflin-St Jeor)

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
| IA Backend | Vercel Serverless Functions (Node.js) |
| IA Providers | Groq (llama-3.3-70b-versatile) + Cerebras (gpt-oss-120b) con fallback automático |
| Tests | Vitest + @vue/test-utils |
| Linting | ESLint 9 (flat config) + Prettier |
| Iconos | Font Awesome Free |

## Por qué existe este proyecto

Avocato es un **proyecto piloto** para experimentar con:

1. **Agentes de código** — Evaluar si un agente de IA puede navegar, comprender y modificar un codebase real sin cometer errores.
2. **Skills de OpenCode** — Probar skills como `frontend-design`, `vue`, `tailwind-css-patterns`, `vitest`, entre otros, en un contexto práctico.
3. **Convenciones de proyecto** — Verificar si un agente respeta paletas de color, arquitectura de componentes, y reglas de negocio preexistentes.

El repositorio incluye un archivo `AGENTS.md` con instrucciones específicas para agentes de IA que trabajen en el proyecto.

## Agentes de IA — Análisis Nutricional

La app integra **dos agentes de IA** con fallback automático para analizar comidas descritas por el usuario. El sistema intenta el proveedor primario y, si falla, recurre al secundario sin intervención del usuario.

### Arquitectura del sistema de IA

```
Frontend (Vue)  →  /api/analyze-meal  →  Groq (primario)  →  Respuesta JSON
                         ↓ (si falla)
                    Cerebras (fallback)  →  Respuesta JSON
```

| Proveedor | Modelo | Rol |
|-----------|--------|-----|
| **Groq** | `llama-3.3-70b-versatile` | Proveedor primario — respuesta rápida y de alta calidad |
| **Cerebras** | `gpt-oss-120b` | Proveedor de respaldo — fallback automático si Groq falla |

### Cómo funciona

1. El usuario describe una comida en texto libre (ej: "ensalada de pollo con aguacate y pan integral").
2. El frontend envía la descripción a `/api/analyze-meal` (Vercel serverless function).
3. El endpoint usa un **system prompt estructurado** que obliga al modelo a responder con un JSON válido que incluye:
   - Nombre del plato y calorías estimadas
   - Macronutrientes (proteínas, carbohidratos, grasas) en gramos, calorías y porcentaje
   - Lista de ingredientes con cantidades estimadas
   - Score nutricional (1-100) con justificación
   - Consejos de bienestar prácticos
   - Nivel de confianza (low / medium / high)
4. La respuesta se valida contra el schema antes de mostrarla al usuario.
5. El usuario puede agregar el resultado analizado directamente a su registro diario de comidas.

### Componentes del analizador

| Componente | Archivo | Función |
|------------|---------|---------|
| `MealAnalyzerForm` | `src/components/nutrition/MealAnalyzerForm.vue` | Textarea + botón de análisis con estados loading/error |
| `NutritionResultCard` | `src/components/nutrition/NutritionResultCard.vue` | Card principal con nombre, calorías, score y confianza |
| `MacroDistribution` | `src/components/nutrition/MacroDistribution.vue` | Barras de distribución de macronutrientes |
| `IngredientBreakdown` | `src/components/nutrition/IngredientBreakdown.vue` | Lista de ingredientes con cantidades y calorías |
| `NutritionTips` | `src/components/nutrition/NutritionTips.vue` | Consejos de bienestar devueltos por la IA |

## Cálculo de BMI y Metas Calóricas

### IMC (Índice de Masa Corporal)

Se calcula con la fórmula estándar de la OMS:

```
BMI = peso (kg) / altura (m)²
```

| Clasificación | Rango BMI | Badge |
|---------------|-----------|-------|
| Bajo peso | < 18.5 | `warning` |
| Peso normal | 18.5 – 24.9 | `success` |
| Sobrepeso | 25 – 29.9 | `warning` |
| Obesidad | ≥ 30 | `danger` |

**Peso ideal** se calcula con la fórmula: `22 × altura (m)²`

El **BMI Gauge** en el perfil muestra un indicador lineal con gradiente de color (verde a rojo) que posiciona el BMI actual en el rango 15–40, con un pill flotante que muestra el valor numérico.

### Metas calóricas (Mifflin-St Jeor)

La app calcula el gasto calórico diario en 3 pasos:

1. **TMB (Tasa Metabólica Basal)** — Fórmula de Mifflin-St Jeor:
   - Hombres: `10 × peso + 6.25 × altura - 5 × edad + 5`
   - Mujeres: `10 × peso + 6.25 × altura - 5 × edad - 161`

2. **TDEE (Gasto Calórico Total)** — TMB × factor de actividad:
   - Sedentario: ×1.2
   - Ligero: ×1.375
   - Moderado: ×1.55
   - Activo: ×1.725
   - Muy activo: ×1.9

3. **Meta diaria** — TDEE × ajuste de objetivo:
   - Perder peso: ×0.8 (déficit del 20%)
   - Mantener: ×1.0
   - Ganar masa: ×1.15 (superávit del 15%)

Se distribuyen automáticamente en macronutrientes: 30% proteínas, 45% carbohidratos, 25% grasas.

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
│   ├── nutrition/             # Analizador de comidas con IA
│   │   ├── MealAnalyzerForm.vue     # Textarea + análisis con loading/error
│   │   ├── NutritionResultCard.vue  # Card con calorías, score, confianza
│   │   ├── MacroDistribution.vue    # Barras de distribución de macros
│   │   ├── IngredientBreakdown.vue  # Lista de ingredientes
│   │   └── NutritionTips.vue        # Consejos de bienestar
│   ├── AppHeader.vue          # Navbar sticky con hamburger menu
│   ├── CalorieRing.vue        # Anillo SVG de progreso calórico
│   ├── FoodCard.vue           # Tarjeta de alimento con Nutri-Score badge
│   ├── FoodDetailModal.vue    # Modal completo con nutrition facts y Nutri-Score
│   └── NutrientCard.vue       # Barra de progreso por macro nutriente
├── hooks/                     # Hooks reutilizables
│   ├── useModal.ts            # Estado open/close/toggle
│   ├── useDebounce.ts         # Debounce genérico con cleanup
│   └── index.ts               # Barrel export
├── composables/               # Composables para lógica reactiva
│   ├── useFoodSearch.ts       # Search state, debounce, performSearch
│   └── useAddFood.ts          # Modal state, openAddModal, confirmAdd
├── views/                     # Vistas principales (todas lazy-loaded)
│   ├── DashboardView.vue
│   ├── ProfileView.vue
│   ├── SearchView.vue
│   └── NutritionAnalyzerView.vue
├── stores/                    # Almacenes Pinia con persistencia localStorage
│   ├── userStore.ts           # Perfil de usuario + metas calóricas
│   └── foodStore.ts           # Registro de comidas del día
├── services/                  # Clientes HTTP
│   ├── openFoodFacts.ts       # API pública de Open Food Facts
│   └── nutritionAI.ts         # Cliente del analizador IA → /api/analyze-meal
├── types/                     # Definiciones TypeScript
│   ├── user.ts                # UserProfile, CalorieGoals, ActivityLevel, GoalType
│   ├── food.ts                # FoodItem, MealEntry, NutritionSummary
│   ├── nutrition.ts           # NutritionAnalysis, MacroValue, Ingredient
│   └── calculator.ts          # BmiResult, IdealWeightResult
├── utils/                     # Funciones puras y constantes
│   ├── mifflinStJeor.ts       # Fórmula Mifflin-St Jeor (TMB/TDEE)
│   ├── bmi.ts                 # Cálculo de IMC y peso ideal
│   ├── bmiClassification.ts   # Clasificación WHO del IMC
│   ├── nutrition.ts           # calcPercentage, groupEntriesByMealType, sumServings
│   ├── formatting.ts          # formatDateEs, formatCalorieEntry
│   └── constants.ts           # MEAL_TYPE_OPTIONS, ACTIVITY_OPTIONS, GOAL_OPTIONS
├── router/index.ts            # Vue Router
├── style.css                  # Tailwind v4 + design tokens import
└── main.ts                    # Entry point

api/                           # Vercel Serverless Functions (backend IA)
├── analyze-meal.ts            # Endpoint POST /api/analyze-meal con fallback
└── providers/
    ├── groq.ts                # Cliente Groq API (llama-3.3-70b-versatile)
    └── cerebras.ts            # Cliente Cerebras API (gpt-oss-120b)
```

## Arquitectura interna

### Separación de responsabilidades

El código está organizado en capas claras:

- **Design System** (`src/design-system/`) — Tokens de diseño y barrel export de todos los componentes reutilizables.
- **Utils** (`src/utils/`) — Funciones puras sin dependencias de Vue. Calculan, transforman y formatean datos. Testables de forma aislada.
- **Hooks** (`src/hooks/`) — Hooks reutilizables (useModal, useDebounce).
- **Composables** (`src/composables/`) — Lógica reactiva extraída de componentes. Manejan estado, efectos secundarios y orquestación.
- **Stores** (`src/stores/`) — Estado global persistido. Solo manejan datos del usuario y registros de comida.
- **Services** (`src/services/`) — Clientes HTTP puros. Solo hacen fetch y transforman la respuesta de APIs externas (Open Food Facts y el endpoint de análisis IA).
- **UI Components** (`src/components/ui/`) — Primitivos del design system: Button, Input, Card, Badge, Modal, Typography.
- **Layout** (`src/components/layout/`) — Container, Stack, Grid para layouts reutilizables.
- **Forms** (`src/components/forms/`) — Field wrapper para formularios.
- **State** (`src/components/state/`) — EmptyState, Loading, ErrorState.
- **Business Components** (`src/components/`) — AppHeader, CalorieRing, FoodCard, FoodDetailModal, NutrientCard. Componen primitivos UI + lógica de negocio.
- **Nutrition Components** (`src/components/nutrition/`) — MealAnalyzerForm, NutritionResultCard, MacroDistribution, IngredientBreakdown, NutritionTips. Componentes del analizador de comidas con IA.

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

- **Frontend sin backend propio** — toda la app corre en el navegador
- **Backend IA** — Vercel Serverless Functions en `/api/` para el análisis nutricional con LLMs
- **localStorage** bajo prefijo `avocato-` para persistir perfil y registros diarios
- **APIs públicas** sin autenticación: Open Food Facts (alimentos)
- **APIs de IA** con autenticación por API key (variables de entorno en Vercel):
  - `GROQ_API_KEY` — Proveedor primario (Groq)
  - `CEREBRAS_API_KEY` — Proveedor de respaldo (Cerebras)

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
- **Tests**: Unit tests en `src/utils/` para funciones puras (48 tests con Vitest).
- **Prettier**: Sin punto y coma, comillas simples, 100 caracteres de ancho.
- **Composables**: La lógica reactiva va en `src/composables/`, no en los componentes directamente.
- **Backend IA**: Las serverless functions en `/api/` usan Groq y Cerebras con fallback automático. No requieren configuración local — corren en Vercel.
- **Variables de entorno**: `GROQ_API_KEY` y `CEREBRAS_API_KEY` se configuran en el dashboard de Vercel, nunca se commitean.

## Licencia

Proyecto privado — creado para fines de experimentación con agentes de IA.
