<script setup lang="ts">
import styles from './Checkbox.module.scss'

interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <label :class="styles['checkbox-wrapper']">
    <input
      type="checkbox"
      :class="styles.checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span v-if="label" :class="[styles['checkbox-label'], disabled && styles['checkbox-label--disabled']]">
      {{ label }}
    </span>
  </label>
</template>
