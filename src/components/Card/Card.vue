<script setup lang="ts">
import styles from './Card.module.scss'

interface Props {
  variant?: 'default' | 'elevated' | 'flat'
  hover?: boolean
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  hover: false,
  title: '',
  subtitle: '',
})
</script>

<template>
  <div
    :class="[
      styles.card,
      variant === 'elevated' && styles['card--elevated'],
      variant === 'flat' && styles['card--flat'],
      hover && styles['card--hover'],
    ]"
  >
    <div v-if="title || subtitle" :class="styles['card__header']">
      <div>
        <h3 v-if="title" :class="styles['card__title']">{{ title }}</h3>
        <p v-if="subtitle" :class="styles['card__subtitle']">{{ subtitle }}</p>
      </div>
      <slot name="header-action" />
    </div>

    <div :class="styles['card__body']">
      <slot />
    </div>

    <div v-if="$slots.footer" :class="styles['card__footer']">
      <slot name="footer" />
    </div>
  </div>
</template>
