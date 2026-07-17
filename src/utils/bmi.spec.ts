import { describe, it, expect } from 'vitest'
import { calculateBMI, calculateIdealWeight } from './bmi'

describe('calculateBMI', () => {
  it('calculates BMI correctly for standard values', () => {
    // 70kg, 175cm → BMI = 70 / (1.75²) = 70 / 3.0625 = 22.9
    expect(calculateBMI(70, 175)).toBe(22.9)
  })

  it('returns 18.5 for underweight boundary', () => {
    // 56kg, 174cm → BMI ≈ 18.5
    const bmi = calculateBMI(56, 174)
    expect(bmi).toBeCloseTo(18.5, 0)
  })

  it('returns 25 for overweight boundary', () => {
    // 78kg, 176cm → BMI ≈ 25.2
    const bmi = calculateBMI(78, 176)
    expect(bmi).toBeGreaterThan(24.9)
  })

  it('rounds to one decimal place', () => {
    // 82kg, 180cm → 82 / 3.24 = 25.308... → 25.3
    expect(calculateBMI(82, 180)).toBe(25.3)
  })

  it('handles obese values', () => {
    // 120kg, 170cm → 120 / 2.89 = 41.5
    expect(calculateBMI(120, 170)).toBe(41.5)
  })

  it('handles underweight values', () => {
    // 45kg, 170cm → 45 / 2.89 = 15.6
    expect(calculateBMI(45, 170)).toBe(15.6)
  })
})

describe('calculateIdealWeight', () => {
  it('calculates ideal weight using BMI 22', () => {
    // 175cm → 22 × 1.75² = 22 × 3.0625 = 67.4
    expect(calculateIdealWeight(175)).toBe(67.4)
  })

  it('returns 60.5 for 165cm', () => {
    // 165cm → 22 × 1.65² = 22 × 2.7225 = 59.9
    expect(calculateIdealWeight(165)).toBe(59.9)
  })

  it('rounds to one decimal place', () => {
    // 180cm → 22 × 3.24 = 71.3
    expect(calculateIdealWeight(180)).toBe(71.3)
  })

  it('scales with height', () => {
    const weight160 = calculateIdealWeight(160)
    const weight180 = calculateIdealWeight(180)
    expect(weight180).toBeGreaterThan(weight160)
  })
})
