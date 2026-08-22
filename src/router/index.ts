import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const SITE_NAME = 'Avocato'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: {
      title: `${SITE_NAME} — Tu diario nutricional`,
      description:
        'Calcula calorías, compone platos equilibrados y recibe consejos de bienestar con Avocato.',
    },
  },
  {
    path: '/platos',
    name: 'plates',
    component: () => import('../views/PlatesView.vue'),
    meta: {
      title: `Mis platos — ${SITE_NAME}`,
      description:
        'Gestiona tus platos analizados, consulta su información nutricional y guárdalos para después.',
    },
  },
  {
    path: '/recetas',
    name: 'recipes-view',
    component: () => import('../views/RecipesView.vue'),
    meta: {
      title: `Mis recetas — ${SITE_NAME}`,
      description:
        'Consulta tus recetas guardadas con información nutricional detallada y recétalas cuando quieras.',
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: {
      title: `Mi perfil — ${SITE_NAME}`,
      description:
        'Configura tus datos personales, objetivos calóricos y preferencias alimentarias.',
    },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/SearchView.vue'),
    meta: {
      title: `Buscar alimentos — ${SITE_NAME}`,
      description:
        'Busca alimentos por nombre o código de barras y consulta su información nutricional completa.',
    },
  },
  {
    path: '/analizar-plato',
    name: 'nutrition-ai',
    component: () => import('../views/NutritionAnalyzerView.vue'),
    meta: {
      title: `Analizar mi plato — ${SITE_NAME}`,
      description:
        'Describe tu comida y obtén un análisis nutricional detallado con inteligencia artificial.',
    },
  },
  {
    path: '/nueva-receta',
    name: 'recipes',
    component: () => import('../views/RecipeGeneratorView.vue'),
    meta: {
      title: `Nueva receta — ${SITE_NAME}`,
      description:
        'Genera recetas personalizadas según tus preferencias, alergias y objetivos nutricionales.',
    },
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/AuthView.vue'),
    meta: {
      title: `Iniciar sesión — ${SITE_NAME}`,
      description:
        'Inicia sesión o crea una cuenta para guardar tu progreso nutricional y acceder a tus datos.',
    },
  },
  {
    path: '/privacidad',
    name: 'privacy',
    component: () => import('../views/PrivacyView.vue'),
    meta: {
      title: `Política de privacidad — ${SITE_NAME}`,
      description:
        'Conoce cómo Avocato protege tu privacidad. Sin rastreo, sin cookies, navegación 100% anónima.',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: `Página no encontrada — ${SITE_NAME}`,
      description: 'La página que buscas no existe o ha sido movida.',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach(to => {
  const title = (to.meta.title as string) || SITE_NAME
  const description = to.meta.description as string | undefined

  document.title = title

  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription && description) {
    metaDescription.setAttribute('content', description)
  }

  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle && description) {
    ogTitle.setAttribute('content', title)
  }

  const ogDescription = document.querySelector('meta[property="og:description"]')
  if (ogDescription && description) {
    ogDescription.setAttribute('content', description)
  }
})

export default router
