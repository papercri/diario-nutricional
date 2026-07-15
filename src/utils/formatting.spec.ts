import { describe, it, expect } from 'vitest'
import { formatDateEs, formatCalorieEntry } from './formatting'

describe('formatDateEs', () => {
  it('returns a string in Spanish', () => {
    const result = formatDateEs(new Date(2025, 0, 15)) // Jan 15, 2025
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('contains the year', () => {
    const result = formatDateEs(new Date(2025, 0, 15))
    expect(result).toContain('2025')
  })

  it('contains a weekday in Spanish', () => {
    const result = formatDateEs(new Date(2025, 0, 15))
    // January 15, 2025 is a Wednesday = miércoles
    expect(result.toLowerCase()).toMatch(/miércoles|martes|lunes|jueves|viernes|sábado|domingo/)
  })
})

describe('formatCalorieEntry', () => {
  it('formats calorie entry correctly', () => {
    const result = formatCalorieEntry(250, 1.5)
    expect(result).toBe('250 kcal × 1.5 = 375 kcal')
  })

  it('handles 1 serving', () => {
    const result = formatCalorieEntry(200, 1)
    expect(result).toBe('200 kcal × 1.0 = 200 kcal')
  })

  it('rounds the total calories', () => {
    const result = formatCalorieEntry(33, 3)
    // 33 * 3 = 99
    expect(result).toBe('33 kcal × 3.0 = 99 kcal')
  })

  it('handles zero calories', () => {
    const result = formatCalorieEntry(0, 2)
    expect(result).toBe('0 kcal × 2.0 = 0 kcal')
  })
})
