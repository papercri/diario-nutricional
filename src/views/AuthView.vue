<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import DsCard from '@/components/ui/Card.vue'
import DsButton from '@/components/ui/Button.vue'
import DsInput from '@/components/ui/Input.vue'
import { isValidEmail, validatePassword } from '@/utils/validators'
import { getErrorMessage } from '@/utils/errorHandlers'

const router = useRouter()
const { signIn, signUp } = useAuth()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const emailTouched = ref(false)
const passwordTouched = ref(false)

const emailError = computed(() => {
  if (!emailTouched.value) return ''
  if (!email.value) return 'El email es obligatorio'
  if (!isValidEmail(email.value)) return 'Email no válido'
  return ''
})

const passwordError = computed(() => {
  if (!passwordTouched.value) return ''
  return validatePassword(password.value, isLogin.value)
})

const formValid = computed(() => {
  return !emailError.value && !passwordError.value && email.value && password.value
})

function handleBlur(field: 'email' | 'password') {
  if (field === 'email') emailTouched.value = true
  else passwordTouched.value = true
}

function togglePassword() {
  showPassword.value = !showPassword.value
}

// getErrorMessage moved to errorHandlers.ts

async function handleSubmit() {
  emailTouched.value = true
  passwordTouched.value = true
  if (!formValid.value) return

  loading.value = true
  error.value = ''
  try {
    if (isLogin.value) {
      await signIn(email.value, password.value)
    } else {
      await signUp(email.value, password.value)
    }
    router.push('/profile')
  } catch (e: unknown) {
    error.value = getErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <DsCard class="auth-card">
      <h1 class="auth-title">{{ isLogin ? 'Iniciar sesión' : 'Crear cuenta' }}</h1>

      <form class="auth-form" novalidate @submit.prevent="handleSubmit">
        <DsInput
          v-model="email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
          :error="emailError"
          required
          @blur="handleBlur('email')"
        />

        <div class="password-field">
          <DsInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :label="isLogin ? 'Contraseña' : 'Contraseña (mín. 6 caracteres)'"
            placeholder="••••••••"
            :error="passwordError"
            required
            @blur="handleBlur('password')"
          />
          <button
            type="button"
            class="password-toggle"
            :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            @click="togglePassword"
          >
            <font-awesome-icon :icon="showPassword ? ['fas', 'eye-slash'] : ['fas', 'eye']" />
          </button>
        </div>

        <p v-if="error" class="auth-error" role="alert">{{ error }}</p>

        <DsButton type="submit" :loading="loading" class="auth-submit">
          {{ isLogin ? 'Entrar' : 'Crear cuenta' }}
        </DsButton>
      </form>

      <p class="auth-toggle">
        {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
        <button
          type="button"
          class="auth-toggle-btn"
          @click="
            isLogin = !isLogin
            error = ''
          "
        >
          {{ isLogin ? 'Crear cuenta' : 'Iniciar sesión' }}
        </button>
      </p>
    </DsCard>
  </main>
</template>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 380px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--clr-text);
  text-align: center;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.auth-submit {
  width: 100%;
  margin-top: 0.25rem;
}

.auth-error {
  font-size: var(--text-sm);
  color: var(--clr-danger);
  text-align: center;
  margin: 0;
}

.auth-toggle {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--clr-text-muted);
  margin: 0;
}

.auth-toggle-btn {
  background: none;
  border: none;
  color: var(--clr-primary);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  font-size: inherit;
  padding: 0;
}
.auth-toggle-btn:hover {
  text-decoration: underline;
}

.password-field {
  position: relative;
}

.password-field :deep(.ds-input) {
  padding-right: 2.5rem;
}

.password-toggle {
  position: absolute;
  right: 0.625rem;
  bottom: 0.625rem;
  background: none;
  border: none;
  color: var(--clr-text-faint);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.password-toggle:hover {
  color: var(--clr-text-muted);
}
</style>
