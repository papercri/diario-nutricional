import type { BmiResult } from '@/types/calculator'

export function classifyBMI(bmi: number): BmiResult['classification'] {
  if (bmi < 18.5) return 'Bajo peso'
  if (bmi < 25) return 'Peso normal'
  if (bmi < 30) return 'Sobrepeso'
  return 'Obesidad'
}

export function getBmiBadgeVariant(bmi: number): BmiResult['badgeVariant'] {
  if (bmi < 18.5) return 'warning'
  if (bmi < 25) return 'success'
  if (bmi < 30) return 'warning'
  return 'danger'
}
