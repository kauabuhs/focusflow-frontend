<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/Button/Button.vue'
import Input from '@/components/Input/Input.vue'
import styles from './RegisterPage.module.scss'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')

function handleRegister() {
  console.log('Register attempt:', { name: name.value, email: email.value })
  router.push('/dashboard')
}
</script>

<template>
  <div :class="styles['register-page']">
    <div :class="styles['register-container']">
      <div :class="styles['register-box']">
        <div :class="styles['register-header']">
          <h1 :class="styles['register-title']">FocusFlow</h1>
          <p :class="styles['register-subtitle']">Create your account</p>
        </div>

        <form @submit.prevent="handleRegister" :class="styles['register-form']">
          <div :class="styles['form-group']">
            <label :class="styles['form-label']">Full Name</label>
            <Input
              v-model="name"
              type="text"
              placeholder="John Doe"
              required
            />
          </div>

          <div :class="styles['form-group']">
            <label :class="styles['form-label']">Email Address</label>
            <Input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div :class="styles['form-group']">
            <label :class="styles['form-label']">Password</label>
            <Input
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            :class="styles['register-btn']"
            style="width: 100%"
          >
            Create Account
          </Button>
        </form>

        <p :class="styles['auth-link-text']">
          Already have an account?
          <RouterLink :to="{ name: 'login' }" :class="styles['auth-link']">
            Sign in
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
