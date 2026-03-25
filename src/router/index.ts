import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// ─── Pages Imports ────────────────────────────────────────────────────────────

// Auth Pages
const LoginPage = () => import('@/pages/auth/LoginPage.vue')
const RegisterPage = () => import('@/pages/auth/RegisterPage.vue')

// Dashboard Pages
const DashboardPage = () => import('@/pages/Dashboard.vue')

// Placeholder pages (you'll create these)
const TasksPage = () => import('@/pages/TasksPage.vue')
const ProjectsPage = () => import('@/pages/ProjectsPage.vue')
const TimerPage = () => import('@/pages/TimerPage.vue')
const AnalyticsPage = () => import('@/pages/AnalyticsPage.vue')
const SettingsPage = () => import('@/pages/SettingsPage.vue')
const NotFoundPage = () => import('@/pages/NotFoundPage.vue')

// ─── Routes Definition ────────────────────────────────────────────────────────

const routes: RouteRecordRaw[] = [
  // ── Authentication Routes (No Layout) ──────────────────────────────────────
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { requiresAuth: false, title: 'Login - FocusFlow' }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { requiresAuth: false, title: 'Register - FocusFlow' }
  },

  // ── App Routes (With Layout) ───────────────────────────────────────────────
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true, title: 'Dashboard - FocusFlow' }
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TasksPage,
    meta: { requiresAuth: true, title: 'Tasks - FocusFlow' }
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectsPage,
    meta: { requiresAuth: true, title: 'Projects - FocusFlow' }
  },
  {
    path: '/timer',
    name: 'timer',
    component: TimerPage,
    meta: { requiresAuth: true, title: 'Focus Timer - FocusFlow' }
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: AnalyticsPage,
    meta: { requiresAuth: true, title: 'Analytics - FocusFlow' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage,
    meta: { requiresAuth: true, title: 'Settings - FocusFlow' }
  },

  // ── Redirect root to dashboard ─────────────────────────────────────────────
  {
    path: '/',
    redirect: '/dashboard'
  },

  // ── 404 Not Found ──────────────────────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
    meta: { title: 'Page Not Found - FocusFlow' }
  }
]

// ─── Router Creation ──────────────────────────────────────────────────────────

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// ─── Route Guards ─────────────────────────────────────────────────────────────

// Update document title
router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || 'FocusFlow'
  next()
})

// Advanced: Add authentication guard here later
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = !!localStorage.getItem('authToken')
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next('/login')
//   } else {
//     next()
//   }
// })

export default router
