export function getErrorMessage(e: unknown): string {
  if (!(e instanceof Error)) return 'Error desconocido'
  const msg = e.message.toLowerCase()
  
  // Auth Errors (Supabase)
  if (msg.includes('invalid login credentials')) return 'Email o contraseña incorrectos'
  if (msg.includes('user already registered')) return 'Este email ya está registrado'
  if (msg.includes('password should be at least'))
    return 'La contraseña debe tener al menos 6 caracteres'
  if (msg.includes('unable to validate email address')) return 'Email no válido'
  if (msg.includes('email not confirmed'))
    return 'Email no confirmado. Revisa tu bandeja de entrada'

  // Network & Rate Limit Errors
  if (msg.includes('429') || msg.includes('too many') || msg.includes('rate limit')) {
    return 'Servidor ocupado. Espera un momento y vuelve a intentar'
  }
  if (msg.includes('timeout')) return 'La conexión ha caducado. Inténtalo de nuevo'
  if (msg.includes('network') || msg.includes('failed to fetch')) return 'Error de conexión. Comprueba tu internet'
  if (msg.includes('forbidden')) return 'Acceso denegado'

  // AI & Parsing Errors (OpenAI)
  if (msg.includes('parse') || msg.includes('invalid json')) {
    return 'Error al procesar los datos. Inténtalo de nuevo'
  }

  return 'Ha ocurrido un error. Inténtalo de nuevo'
}
