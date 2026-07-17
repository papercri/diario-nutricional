export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100
  return Math.round((weight / (heightM * heightM)) * 10) / 10
}

export function calculateIdealWeight(heightCm: number): number {
  const heightM = heightCm / 100
  return Math.round(22 * heightM * heightM * 10) / 10
}
