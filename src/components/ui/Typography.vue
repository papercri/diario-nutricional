<script setup lang="ts">
import { computed } from 'vue'

type TypographyVariant =
  | 'display-xl'
  | 'display-lg'
  | 'display-sm'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'label'
  | 'label-sm'

type TypographyTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'

const props = withDefaults(
  defineProps<{
    variant?: TypographyVariant
    as?: TypographyTag
    color?: 'primary' | 'accent' | 'secondary' | 'muted' | 'faint' | 'inverse' | 'default'
    align?: 'left' | 'center' | 'right'
    truncate?: boolean
  }>(),
  {
    variant: 'body',
    color: 'default',
    align: 'left',
    truncate: false,
  },
)

const variantTagMap: Record<TypographyVariant, TypographyTag> = {
  'display-xl': 'h1',
  'display-lg': 'h2',
  'display-sm': 'h3',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  label: 'span',
  'label-sm': 'span',
}

const computedTag = computed<TypographyTag>(() => props.as ?? variantTagMap[props.variant])

const colorMap: Record<string, string> = {
  primary: 'var(--clr-primary)',
  accent: 'var(--clr-accent)',
  secondary: 'var(--clr-secondary)',
  muted: 'var(--clr-text-muted)',
  faint: 'var(--clr-text-faint)',
  inverse: 'var(--clr-text-inverse)',
  default: 'var(--clr-text)',
}

const variantClasses: Record<TypographyVariant, string> = {
  'display-xl': 'text-display-xl',
  'display-lg': 'text-display-lg',
  'display-sm': 'text-display-sm',
  h1: 'text-display-xl',
  h2: 'text-display-lg',
  h3: 'text-display-sm',
  h4: 'text-label',
  body: 'text-body',
  'body-sm': 'text-body-sm',
  caption: 'text-body-sm',
  label: 'text-label',
  'label-sm': 'text-label-sm',
}

const computedClass = computed(() => variantClasses[props.variant])

const computedStyle = computed(() => ({
  color: colorMap[props.color],
  textAlign: props.align,
}))
</script>

<template>
  <component :is="computedTag" :class="[computedClass, { truncate }]" :style="computedStyle">
    <slot />
  </component>
</template>
