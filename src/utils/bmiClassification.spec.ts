import { describe, it, expect } from 'vitest'
import { classifyBMI, getBmiBadgeVariant } from './bmiClassification'

describe('classifyBMI', () => {
  it('returns Bajo peso for BMI < 18.5', () => {
    expect(classifyBMI(16)).toBe('Bajo peso')
    expect(classifyBMI(18.4)).toBe('Bajo peso')
  })

  it('returns Peso normal for BMI 18.5–24.9', () => {
    expect(classifyBMI(18.5)).toBe('Peso normal')
    expect(classifyBMI(22)).toBe('Peso normal')
    expect(classifyBMI(24.9)).toBe('Peso normal')
  })

  it('returns Sobrepeso for BMI 25–29.9', () => {
    expect(classifyBMI(25)).toBe('Sobrepeso')
    expect(classifyBMI(27.5)).toBe('Sobrepeso')
    expect(classifyBMI(29.9)).toBe('Sobrepeso')
  })

  it('returns Obesidad for BMI >= 30', () => {
    expect(classifyBMI(30)).toBe('Obesidad')
    expect(classifyBMI(35)).toBe('Obesidad')
    expect(classifyBMI(45)).toBe('Obesidad')
  })
})

describe('getBmiBadgeVariant', () => {
  it('returns warning for underweight', () => {
    expect(getBmiBadgeVariant(16)).toBe('warning')
  })

  it('returns success for normal weight', () => {
    expect(getBmiBadgeVariant(22)).toBe('success')
  })

  it('returns warning for overweight', () => {
    expect(getBmiBadgeVariant(27)).toBe('warning')
  })

  it('returns danger for obesity', () => {
    expect(getBmiBadgeVariant(32)).toBe('danger')
  })
})
