export interface BmiResult {
  value: number
  classification: string
  badgeVariant: 'success' | 'warning' | 'danger' | 'info' | 'default'
}

export interface IdealWeightResult {
  idealWeight: number
  difference: number
}
