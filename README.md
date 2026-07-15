# Avocato 

Web app para calcular calorías diarias, componer platos equilibrados y recibir consejos de bienestar. Diseñada con una estética fresca y amigable en tonos verde-amarillo.

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

## Por qué existe este proyecto

Avocato es un **proyecto piloto** para experimentar con:

1. **Agentes de código** — Evaluar si un agente de IA puede navegar, comprender y modificar un codebase real sin cometer errores.
2. **Skills de OpenCode** — Probar skills como `frontend-design`, `vue`, `tailwind-css-patterns`, `vitest`, entre otros, en un contexto práctico.
3. **Convenciones de proyecto** — Verificar si un agente respeta paletas de color, arquitectura de componentes, y reglas de negocio preexistentes.

El repositorio incluye un archivo `AGENTS.md` con instrucciones específicas para agentes de IA que trabajen en el proyecto.

## Arquitectura

```
src/
├── components/          # Componentes Vue reutilizables
│   ├── AppHeader.vue    # Navbar sticky con navegación
│   ├── CalorieRing.vue  # Anillo SVG de progreso calórico (elemento signature)
│   ├── FoodCard.vue     # Tarjeta de alimento con opción "Añadir"
│   └── NutrientCard.vue # Barra de progreso por macro nutriente
├── views/               # Vistas principales (todas lazy-loaded)
│   ├── DashboardView.vue
│   ├── ProfileView.vue
│   ├── SearchView.vue
│   └── TipsView.vue
├── stores/              # Almacenes Pinia con persistencia localStorage
│   ├── userStore.ts     # Perfil de usuario + metas calóricas
│   └── foodStore.ts     # Registro de comidas del día
├── services/            # Clientes HTTP
│   ├── openFoodFacts.ts # API pública de Open Food Facts
│   └── tipsService.ts   # API de consejos + fallback local
├── types/               # Definiciones TypeScript
│   ├── user.ts
│   └── food.ts
├── utils/               # Funciones puras
│   └── mifflinStJeor.ts # Fórmula Mifflin-St Jeor (TMB/TDEE)
├── router/index.ts      # Vue Router
├── style.css            # Tailwind v4 + tokens avocado-*/honey-*
└── main.ts              # Entry point
```

## Datos y persistencia

- **Sin backend** — toda la app corre en el navegador
- **localStorage** bajo prefijo `avocato-` para persistir perfil y registros diarios
- **APIs públicas** sin autenticación: Open Food Facts (alimentos) y Advice Slip (consejos)

## Diseño visual

- **Paleta**: verdes frescos (`emerald-*`, `lime-*`) + amarillos suaves (`amber-*`)
- **Tipografía**: Nunito (display/headings) + Inter (body) vía Google Fonts
- **Elemento signature**: CalorieRing con efecto de glow SVG
- **Transiciones**: page transitions entre rutas, hover micro-interactions
- **Responsive**: mobile-first, funciona desde 320px

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

- **Tailwind v4**: No existe `tailwind.config.js`. La configuración está en `src/style.css` con `@theme`.
- **Alias `@`**: Mapea a `./src`. Usa `@/components/...` en imports.
- **Sin tests aún**: Los primeros tests deben ir en `src/utils/` (funciones puras).
- **Prettier**: Sin punto y coma, comillas simples, 100 caracteres de ancho.

## Licencia

Proyecto privado — creado para fines de experimentación con agentes de IA.
