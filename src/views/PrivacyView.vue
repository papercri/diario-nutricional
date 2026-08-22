<script setup lang="ts">
import { computed } from 'vue'
import Card from '@/components/ui/Card.vue'

const emailUser = computed(() => ['cristiana', 'sollini'].join('.'))
const emailDomain = computed(() => ['gmail', 'com'].join('.'))
const mailto = computed(() => `mailto:${emailUser.value}@${emailDomain.value}`)
</script>

<template>
  <main class="privacy">
    <header class="dash__header">
      <h1 class="text-display-lg">
        <font-awesome-icon
          :icon="['fas', 'user-shield']"
          aria-hidden="true"
          style="color: var(--clr-primary)"
        />
        Información sobre Privacidad
      </h1>
      <p class="text-body-sm">Última actualización: Agosto 2026</p>
    </header>

    <Card variant="warm" padding="md">
      <section class="privacy__section">
<<<<<<< HEAD
        <h2 class="privacy__h2">Compromiso de Privacidad</h2>
        <p class="privacy__text">
          Este sitio web es un proyecto personal y de carácter informativo. Tu privacidad es
          importante. Por eso, te explico cómo manejo tus datos de forma transparente:
        </p>
        <ul class="privacy__list">
          <li>
            <strong>Registro mínimo:</strong> Solo solicito tu correo electrónico cuando creas una
            cuenta o inicias sesión mediante Supabase Auth. Este dato se usa únicamente para
            permitir tu acceso a la plataforma.
          </li>
          <li>
            <strong>Sin fines comerciales:</strong> No vendo, alquilo ni comparto tu correo
            electrónico ni ningún otro dato con empresas, marcas ni terceros con fines publicitarios
            o comerciales.
          </li>
          <li>
            <strong>Sin cookies de rastreo:</strong> No utilizo herramientas de seguimiento externo,
            publicidad intrusiva ni analíticas que rastreen tu comportamiento por la web.
          </li>
          <li>
            <strong>Seguridad de los datos:</strong> Tu información de acceso se almacena de forma
            segura en la infraestructura de Supabase y solo se emplea para mantener tu sesión
            activa.
=======
        <h2 class="privacy__h2">Compromiso de Privacidad Absoluta</h2>
        <p class="privacy__text">
          Este sitio web es puramente informativo. Quiero que navegues con total tranquilidad, por
          lo que te informo de lo siguiente:
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
>>>>>>> 7262349d519ffb7a014cb0384b5a67348dd67b52
          </li>
        </ul>
      </section>
    </Card>

    <Card variant="warm" padding="md">
      <section class="privacy__section">
        <h2 class="privacy__h2">Contacto</h2>
        <p class="privacy__text">
<<<<<<< HEAD
          Si tienes cualquier duda sobre tu cuenta, el funcionamiento de la web o el manejo de tus
          datos, puedes ponerte en contacto conmigo a través de la siguiente dirección de correo
          electrónico:
=======
          Si tienes cualquier duda sobre este sitio web, puedes ponerte en contacto conmigo a través
          de la siguiente dirección de correo electrónico:
>>>>>>> 7262349d519ffb7a014cb0384b5a67348dd67b52
        </p>
        <a :href="mailto" class="privacy__email">{{ emailUser }}<wbr />@{{ emailDomain }}</a>
      </section>
    </Card>
  </main>
</template>

<style scoped>
.privacy {
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.privacy__section {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.privacy__h2 {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--clr-text);
  margin: 0;
}

.privacy__text {
  font-size: var(--text-sm);
  color: var(--clr-text-muted);
  line-height: 1.6;
  margin: 0;
}

.privacy__list {
  padding-left: 1.25rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: var(--text-sm);
  color: var(--clr-text-muted);
  line-height: 1.6;
}

.privacy__list li {
  margin: 0;
}

.privacy__list strong {
  color: var(--clr-text);
}

.privacy__email {
  font-size: var(--text-sm);
  color: var(--clr-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
  word-break: break-all;
  font-weight: var(--weight-medium);
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
