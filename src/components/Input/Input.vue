<script setup lang="ts">
import styles from './Input.module.scss'

interface Props {
  modelValue?: string
  type?: string
  placeholder?: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  label: '',
  size: 'md',
  error: '',
  hint: '',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()
</script>

<template>
  <div :class="styles['input-wrapper']">
    <label v-if="label" :class="[styles['input-label'], required && styles['input-label--required']]">
      {{ label }}
    </label>
    <input
      :class="[
        styles.input,
        styles[`input--${size}`],
        error && styles['input--error'],
        disabled && styles['input--disabled'],
      ]"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur', $event as FocusEvent)"
      @focus="emit('focus', $event as FocusEvent)"
    />
    <span v-if="error" :class="styles['input-error']">
      {{ error }}
    </span>
    <span v-if="hint && !error" :class="styles['input-hint']">
      {{ hint }}
    </span>
  </div>
</template>
