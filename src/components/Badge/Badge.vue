<script setup lang="ts">
import styles from './Badge.module.scss'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'
  solid?: boolean
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  variant: 'gray',
  solid: false,
  size: 'md',
})
</script>

<template>
  <span
    :class="[
      styles.badge,
      solid ? styles[`badge--solid-${variant}`] : styles[`badge--${variant}`],
      styles[`badge--${size}`],
    ]"
  >
    <slot />
  </span>
</template>
