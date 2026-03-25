<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-box">
        <h1>FocusFlow</h1>
        <p class="subtitle">Create your account</p>
        
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>Full Name</label>
            <input 
              v-model="name" 
              type="text" 
              placeholder="John Doe"
              required
            />
          </div>

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

          <button type="submit" class="register-btn">Create Account</button>
        </form>

        <p class="signin-text">
          Already have an account? 
          <RouterLink to="/login">Sign in</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')

function handleRegister() {
  // TODO: Implement registration
  console.log('Register attempt:', { name: name.value, email: email.value })
  router.push('/dashboard')
}
</script>

<style scoped>
.register-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', sans-serif;
}

.register-container {
  width: 100%;
  max-width: 420px;
}

.register-box {
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

.register-btn {
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

.register-btn:hover {
  opacity: 0.9;
}

.signin-text {
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
