<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/Button/Button.vue'
import Input from '@/components/Input/Input.vue'
import styles from './LoginPage.module.scss'

const router = useRouter()
const email = ref('')
const password = ref('')

function handleLogin() {
  console.log('Login attempt:', { email: email.value, password: password.value })
  router.push('/dashboard')
}
</script>

<template>
  <div :class="styles['login-page']">
    <div :class="styles['login-container']">
      <div :class="styles['login-box']">
        <div :class="styles['login-header']">
          <h1 :class="styles['login-title']">FocusFlow</h1>
          <p :class="styles['login-subtitle']">Welcome Back</p>
        </div>

        <form @submit.prevent="handleLogin" :class="styles['login-form']">
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
            :class="styles['login-btn']"
            style="width: 100%"
          >
            Sign In
          </Button>
        </form>

        <p :class="styles['auth-link-text']">
          Don't have an account?
          <RouterLink :to="{ name: 'register' }" :class="styles['auth-link']">
            Sign up
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
