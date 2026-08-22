<script setup lang="ts">
import { computed } from 'vue'

const emailUser = computed(() => ['cristiana', 'sollini'].join('.'))
const emailDomain = computed(() => ['gmail', 'com'].join('.'))
const mailto = computed(() => `mailto:${emailUser.value}@${emailDomain.value}`)
</script>

<template>
  <main class="privacy">
    <h1 class="text-display-lg">Información sobre Privacidad</h1>
    <p class="privacy__date">Última actualización: Agosto 2026</p>

    <section>
      <h2 class="text-display-sm">Compromiso de Privacidad Absoluta</h2>
      <p>
        Este sitio web es puramente informativo. Quiero que navegues con total tranquilidad, por lo
        que te informo de lo siguiente:
      </p>
      <ul class="privacy__list">
        <li>
          <strong>Sin formularios ni registros:</strong> Esta web no solicita, no recoge, ni
          almacena ningún tipo de dato personal (como tu nombre, teléfono o correo electrónico).
        </li>
        <li>
          <strong>Sin cookies de rastreo:</strong> No utilizo herramientas de seguimiento,
          publicidad ni analíticas web (como Google Analytics) que puedan identificarte o rastrear
          tu comportamiento en internet.
        </li>
        <li>
          <strong>Navegación 100% anónima:</strong> Puedes revisar todo el contenido del sitio web
          de forma completamente privada.
        </li>
      </ul>
    </section>

    <section>
      <h2 class="text-display-sm">Contacto</h2>
      <p>
        Si tienes cualquier duda sobre este sitio web, puedes ponerte en contacto conmigo a través
        de la siguiente dirección de correo electrónico:
        <a :href="mailto" class="privacy__email">{{ emailUser }}<wbr />@{{ emailDomain }}</a>
      </p>
    </section>
  </main>
</template>

<style scoped>
.privacy {
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  padding: 2rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.privacy__date {
  font-size: var(--text-sm);
  color: var(--clr-text-faint);
}

.privacy__list {
  padding-left: 1.25rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--clr-text-muted);
}

.privacy__email {
  color: var(--clr-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
  word-break: break-all;
}

.privacy__email:hover {
  color: var(--clr-primary-hover);
}

@media (prefers-reduced-motion: reduce) {
  .privacy__email:hover {
    text-decoration: none;
  }
}
</style>
