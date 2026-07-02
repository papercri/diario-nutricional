const FALLBACK_TIPS: string[] = [
  'Beber 2 litros de agua al día ayuda a mantener tu metabolismo activo.',
  'Incluir proteína en cada comida favorece la saciedad y la recuperación muscular.',
  'Dormir 7-8 horas es clave para regular las hormonas del hambre.',
  'Los vegetales de hoja verde son bajos en calorías y altos en nutrientes esenciales.',
  'Comer despacio permite que tu cerebro registre la saciedad a tiempo.',
  'El ejercicio matutino acelera el metabolismo durante todo el día.',
  'Planificar tus comidas con antelación reduce las decisiones impulsivas.',
  'Los frutos secos son un gran snack: aportan grasas saludables y energía sostenida.',
  'Reducir el azúcar añadido mejora tus niveles de energía y tu salud digestiva.',
  'Caminar 30 minutos al día reduce el estrés y mejora la circulación.',
  'El aguacate es rico en grasas monoinsaturadas, ideales para el corazón.',
  'Mantener un horario regular de comidas ayuda a estabilizar el metabolismo.',
  'La fibra soluble (avena, manzana, legumbres) ayuda a controlar el colesterol.',
  'Tomar el sol 15 minutos al día favorece la síntesis de vitamina D.',
  'El té verde contiene antioxidantes que apoyan la quema de grasas.',
]

let tipCache: string[] = []
let lastFetch = 0
const CACHE_DURATION = 3600000

export interface TipResult {
  tip: string
  source: 'api' | 'cache' | 'fallback'
}

export async function fetchTip(): Promise<TipResult> {
  const now = Date.now()

  if (tipCache.length > 0 && now - lastFetch < CACHE_DURATION) {
    return { tip: tipCache[Math.floor(Math.random() * tipCache.length)], source: 'cache' }
  }

  try {
    const response = await fetch('https://api.adviceslip.com/advice')
    if (!response.ok) throw new Error('API response not ok')

    const data = await response.json()
    const tip: string = data.slip?.advice

    if (tip) {
      tipCache = [tip, ...FALLBACK_TIPS]
      lastFetch = now
      return { tip, source: 'api' }
    }

    throw new Error('No advice in response')
  } catch {
    const tip = FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)]
    return { tip, source: 'fallback' }
  }
}
