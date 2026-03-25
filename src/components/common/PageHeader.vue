<script setup lang="ts">
import styles from './PageHeader.module.scss'

interface Props {
  title: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
})
</script>

<template>
  <div :class="styles['page-header']">
    <div :class="styles['page-header__text']">
      <h1 :class="styles['page-header__title']">{{ title }}</h1>
      <p v-if="subtitle" :class="styles['page-header__subtitle']">{{ subtitle }}</p>
    </div>

    <div v-if="$slots.actions" :class="styles['page-header__actions']">
      <slot name="actions" />
    </div>
  </div>
</template>

