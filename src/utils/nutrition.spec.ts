import { describe, it, expect } from 'vitest'
import { calcPercentage, calcRemaining, groupEntriesByMealType, sumServings } from './nutrition'
import type { MealEntry } from '../types/food'

describe('calcPercentage', () => {
  it('calculates percentage correctly', () => {
    expect(calcPercentage(50, 100)).toBe(50)
    expect(calcPercentage(100, 100)).toBe(100)
    expect(calcPercentage(0, 100)).toBe(0)
  })

  it('caps at 100%', () => {
    expect(calcPercentage(150, 100)).toBe(100)
    expect(calcPercentage(200, 100)).toBe(100)
  })

  it('returns 0 when target is 0', () => {
    expect(calcPercentage(50, 0)).toBe(0)
  })

  it('returns 0 when target is negative', () => {
    expect(calcPercentage(50, -10)).toBe(0)
  })

  it('handles decimal values', () => {
    expect(calcPercentage(33.33, 100)).toBeCloseTo(33.33, 1)
  })
})

describe('calcRemaining', () => {
  it('calculates remaining correctly', () => {
    expect(calcRemaining(50, 100)).toBe(50)
    expect(calcRemaining(0, 100)).toBe(100)
    expect(calcRemaining(100, 100)).toBe(0)
  })

  it('floors at 0 when consumed exceeds target', () => {
    expect(calcRemaining(150, 100)).toBe(0)
    expect(calcRemaining(200, 100)).toBe(0)
  })

  it('handles equal values', () => {
    expect(calcRemaining(500, 500)).toBe(0)
  })
})

function makeEntry(id: string, mealType: MealEntry['mealType'], servings: number): MealEntry {
  return {
    id,
    food: { id, name: `Food ${id}`, calories: 100, protein: 10, carbs: 20, fat: 5 },
    servings,
    mealType,
    date: '2025-01-15',
    timestamp: Date.now(),
  }
}

describe('groupEntriesByMealType', () => {
  it('groups entries by meal type', () => {
    const entries = [
      makeEntry('1', 'breakfast', 1),
      makeEntry('2', 'lunch', 2),
      makeEntry('3', 'breakfast', 0.5),
    ]
    const groups = groupEntriesByMealType(entries)
    expect(groups.breakfast).toHaveLength(2)
    expect(groups.lunch).toHaveLength(1)
    expect(groups.dinner).toBeUndefined()
    expect(groups.snack).toBeUndefined()
  })

  it('returns empty object for empty array', () => {
    const groups = groupEntriesByMealType([])
    expect(Object.keys(groups)).toHaveLength(0)
  })
})

describe('sumServings', () => {
  it('sums servings correctly', () => {
    const entries = [
      makeEntry('1', 'breakfast', 1),
      makeEntry('2', 'lunch', 2),
      makeEntry('3', 'dinner', 1.5),
    ]
    expect(sumServings(entries)).toBe(4.5)
  })

  it('returns 0 for empty array', () => {
    expect(sumServings([])).toBe(0)
  })

  it('handles single entry', () => {
    expect(sumServings([makeEntry('1', 'snack', 3)])).toBe(3)
  })
})
