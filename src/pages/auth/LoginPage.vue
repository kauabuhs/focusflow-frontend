<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <h1>FocusFlow</h1>
        <p class="subtitle">Welcome Back</p>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Email</label>
            <input 
              v-model="email" 
              type="email" 
              placeholder="you@example.com"
              required
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" class="login-btn">Sign In</button>
        </form>

        <p class="signup-text">
          Don't have an account? 
          <RouterLink to="/register">Sign up</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

function handleLogin() {
  // TODO: Implement authentication
  console.log('Login attempt:', { email: email.value, password: password.value })
  router.push('/dashboard')
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', sans-serif;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

h1 {
  margin: 0 0 4px;
  font-size: 28px;
  color: #2563eb;
  font-weight: 700;
}

.subtitle {
  margin: 0 0 24px;
  color: #6b7280;
  font-size: 14px;
}

.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

label {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
}

input {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #2563eb;
}

.login-btn {
  width: 100%;
  padding: 10px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: opacity 0.2s;
}

.login-btn:hover {
  opacity: 0.9;
}

.signup-text {
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  margin-top: 16px;
}

a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

a:hover {
  text-decoration: underline;
}
</style>
