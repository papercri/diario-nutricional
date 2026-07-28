export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(password: string, isLogin: boolean): string {
  if (!password) return 'La contraseña es obligatoria'
  if (!isLogin && password.length < 6) return 'Mínimo 6 caracteres'
  return ''
}

export function isRequired(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return 'Este campo es obligatorio'
  }
  return ''
}

export function isValidMacro(value: number): boolean {
  return typeof value === 'number' && value >= 0
}
