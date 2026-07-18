import { describe, it, expect } from 'vitest'
import { calculateBMR, calculateTDEE, calculateCalorieGoals } from './mifflinStJeor'
import type { UserProfile } from '../types/user'

describe('calculateBMR', () => {
  it('calculates BMR for males using Mifflin-St Jeor', () => {
    // 70kg, 175cm, 30 years male
    // 10*70 + 6.25*175 - 5*30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75
    const bmr = calculateBMR(70, 175, 30, 'male')
    expect(bmr).toBe(1648.75)
  })

  it('calculates BMR for females using Mifflin-St Jeor', () => {
    // 60kg, 165cm, 25 years female
    // 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
    const bmr = calculateBMR(60, 165, 25, 'female')
    expect(bmr).toBe(1345.25)
  })

  it('returns different BMR for male vs female with same stats', () => {
    const maleBMR = calculateBMR(70, 175, 30, 'male')
    const femaleBMR = calculateBMR(70, 175, 30, 'female')
    expect(maleBMR).toBeGreaterThan(femaleBMR)
    expect(maleBMR - femaleBMR).toBe(166) // 5 - (-161) = 166
  })
})

describe('calculateTDEE', () => {
  it('multiplies BMR by activity level', () => {
    expect(calculateTDEE(1600, 'sedentary')).toBe(1920) // 1600 * 1.2
    expect(calculateTDEE(1600, 'light')).toBe(2200) // 1600 * 1.375 = 2200
    expect(calculateTDEE(1600, 'moderate')).toBe(2480) // 1600 * 1.55
    expect(calculateTDEE(1600, 'active')).toBe(2760) // 1600 * 1.725
    expect(calculateTDEE(1600, 'very_active')).toBe(3040) // 1600 * 1.9
  })

  it('defaults to sedentary multiplier for unknown activity level', () => {
    expect(calculateTDEE(1600, 'unknown')).toBe(1920)
  })

  it('rounds the result', () => {
    // 1500 * 1.375 = 2062.5 → 2063
    expect(calculateTDEE(1500, 'light')).toBe(2063)
  })
})

describe('calculateCalorieGoals', () => {
  const baseProfile: UserProfile = {
    name: 'Test',
    age: 30,
    weight: 70,
    height: 175,
    desiredWeight: 65,
    sex: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
  }

  it('calculates full goals for a male maintaining weight', () => {
    const goals = calculateCalorieGoals(baseProfile)
    // BMR = 1648.75, TDEE = round(1648.75 * 1.55) = 2556
    expect(goals.bmr).toBe(1648.75)
    expect(goals.tdee).toBe(2556)
    expect(goals.targetCalories).toBe(2556) // maintain = 1.0
    expect(goals.proteinGrams).toBe(Math.round((2556 * 0.3) / 4))
    expect(goals.fatGrams).toBe(Math.round((2556 * 0.25) / 9))
    expect(goals.carbGrams).toBe(Math.round((2556 * 0.45) / 4))
  })

  it('reduces calories for lose goal', () => {
    const goals = calculateCalorieGoals({ ...baseProfile, goal: 'lose' })
    expect(goals.targetCalories).toBe(Math.round(goals.tdee * 0.8))
  })

  it('increases calories for gain goal', () => {
    const goals = calculateCalorieGoals({ ...baseProfile, goal: 'gain' })
    expect(goals.targetCalories).toBe(Math.round(goals.tdee * 1.15))
  })

  it('macros add up to approximately the target calories', () => {
    const goals = calculateCalorieGoals(baseProfile)
    // protein: 30%, fat: 25%, carbs: 45% of targetCalories
    const proteinCals = goals.proteinGrams * 4
    const fatCals = goals.fatGrams * 9
    const carbCals = goals.carbGrams * 4
    // Allow rounding error of ±10 kcal
    expect(proteinCals + fatCals + carbCals).toBeCloseTo(goals.targetCalories, -1)
  })
})
