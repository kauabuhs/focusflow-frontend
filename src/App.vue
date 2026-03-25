<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const publicRoutes = ['/login', '/register', '/forgot-password']
const router = useRouter()

const isPublicRoute = () => publicRoutes.includes(router.currentRoute.value.path)
</script>

<template>
  <AppLayout v-if="!isPublicRoute()">
    <RouterView />
  </AppLayout>
  <RouterView v-else />
</template>
