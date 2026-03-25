<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  Timer,
  BarChart2,
  Settings,
  Bell,
  HelpCircle,
  Play,
  Search,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-vue-next'
import styles from './AppLayout.module.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  icon: ReturnType<typeof LayoutDashboard>
  to: string
}

interface User {
  name: string
  plan: string
  avatarUrl?: string
  initials: string
}

// ─── Navigation ───────────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  { label: 'Dashboard',   icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Tasks',       icon: CheckSquare,     to: '/tasks'     },
  { label: 'Projects',    icon: FolderOpen,      to: '/projects'  },
  { label: 'Focus Timer', icon: Timer,           to: '/timer'     },
  { label: 'Analytics',   icon: BarChart2,       to: '/analytics' },
  { label: 'Settings',    icon: Settings,        to: '/settings'  },
]

// ─── State ────────────────────────────────────────────────────────────────────

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const notificationCount = ref(3)
const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)
const dropdownOpen = ref(false)
const userDropdownOpen = ref(false)
const sidebarUserMenuEl = ref<HTMLElement | null>(null)
const headerUserMenuEl = ref<HTMLElement | null>(null)

const currentUser = ref<User>({
  name: 'Alex Rivera',
  plan: 'Pro Account',
  initials: 'AR',
  avatarUrl: undefined,
})

// ─── Computed ─────────────────────────────────────────────────────────────────

const isActive = (to: string): boolean => route.path === to
const hasNotifications = computed(() => notificationCount.value > 0)

// ─── Methods ──────────────────────────────────────────────────────────────────

function navigate(to: string): void {
  router.push(to)
  sidebarOpen.value = false
  dropdownOpen.value = false
  userDropdownOpen.value = false
}

function startFocusSession(): void {
  router.push('/timer')
}

function handleSearch(e: KeyboardEvent): void {
  if (e.key === 'Enter' && searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}

function logout(): void {
  console.log('Logout')
}

function toggleDropdown(): void {
  dropdownOpen.value = !dropdownOpen.value
  userDropdownOpen.value = false
}

function toggleUserDropdown(): void {
  userDropdownOpen.value = !userDropdownOpen.value
  dropdownOpen.value = false
}

function toggleSidebar(): void {
  sidebarOpen.value = !sidebarOpen.value
  dropdownOpen.value = false
  userDropdownOpen.value = false
}

function toggleCollapse(): void {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
  dropdownOpen.value = false
  userDropdownOpen.value = false
}

function closeAllOverlays(): void {
  sidebarOpen.value = false
  dropdownOpen.value = false
  userDropdownOpen.value = false
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') closeAllOverlays()
}

watch(
  () => route.path,
  () => {
    sidebarOpen.value = false
    dropdownOpen.value = false
    userDropdownOpen.value = false
  }
)

onClickOutside(sidebarUserMenuEl, () => {
  dropdownOpen.value = false
})

onClickOutside(headerUserMenuEl, () => {
  userDropdownOpen.value = false
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  const saved = localStorage.getItem('sidebarCollapsed')
  if (saved) sidebarCollapsed.value = saved === 'true'
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div :class="styles['app-layout']">
    <div
      v-if="sidebarOpen"
      :class="styles['app-layout__overlay']"
      @click="closeAllOverlays"
    />
    <!-- ═════════════════════════════════════ SIDEBAR ═════════════════════════════════════ -->
    <aside
      :class="[
        styles['app-layout__sidebar'],
        sidebarOpen && styles['app-layout__sidebar--open'],
        sidebarCollapsed && styles['app-layout__sidebar--collapsed'],
      ]"
    >
      
      <!-- Brand -->
      <div :class="styles['app-layout__brand']">
        <h1 :class="styles['app-layout__brand-title']">FocusFlow</h1>
        <p :class="styles['app-layout__brand-subtitle']">Productivity Platform</p>
        
        <!-- Collapse Button (Desktop only) -->
        <button
          @click="toggleCollapse"
          :class="styles['app-layout__collapse-btn']"
          :aria-label="sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'"
          :title="sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'"
        >
          <ChevronLeft v-if="!sidebarCollapsed" :class="styles['app-layout__collapse-icon']" />
          <ChevronRight v-else :class="styles['app-layout__collapse-icon']" />
        </button>
      </div>

      <!-- Navigation -->
      <nav :class="styles['app-layout__nav']">
        <button
          v-for="item in navItems"
          :key="item.to"
          @click="navigate(item.to)"
          :class="[
            styles['app-layout__nav-item'],
            isActive(item.to) && styles['app-layout__nav-item--active'],
            sidebarCollapsed && styles['app-layout__nav-item--collapsed'],
          ]"
          :title="item.label"
        >
          <component :is="item.icon" :class="styles['app-layout__nav-icon']" />
          <span :class="styles['app-layout__nav-label']">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Sidebar Footer -->
      <div :class="[
        styles['app-layout__sidebar-footer'],
        sidebarCollapsed && styles['app-layout__sidebar-footer--collapsed'],
      ]">
        <!-- Focus Session Button -->
        <button
          @click="startFocusSession"
          :class="[
            styles['app-layout__focus-btn'],
            sidebarCollapsed && styles['app-layout__focus-btn--collapsed'],
          ]"
          :title="sidebarCollapsed ? 'Iniciar sessão de foco' : undefined"
        >
          <Play class="w-4 h-4" />
          <span v-if="!sidebarCollapsed">Focus Session</span>
        </button>

        <!-- User Profile Dropdown -->
        <div ref="sidebarUserMenuEl" :class="styles['app-layout__user-dropdown']">
          <button
            @click="toggleDropdown"
            :class="[
              styles['app-layout__user-profile'],
              sidebarCollapsed && styles['app-layout__user-profile--collapsed'],
            ]"
            aria-haspopup="menu"
            :aria-expanded="dropdownOpen"
          >
            <!-- Avatar -->
            <div :class="styles['app-layout__user-avatar']">
              <div :class="styles['app-layout__avatar-gradient']">
                {{ currentUser.initials }}
              </div>
            </div>

            <!-- User Info -->
            <div v-if="!sidebarCollapsed" :class="styles['app-layout__user-info']">
              <p :class="styles['app-layout__user-name']">{{ currentUser.name }}</p>
              <p :class="styles['app-layout__user-plan']">{{ currentUser.plan }}</p>
            </div>

            <ChevronDown v-if="!sidebarCollapsed" :class="styles['app-layout__chevron']" />
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="dropdownOpen"
            :class="[
              styles['app-layout__dropdown'],
              styles['app-layout__dropdown--sidebar'],
            ]"
          >
            <button
              @click="navigate('/settings')"
              :class="styles['app-layout__dropdown-item']"
            >
              <Settings :class="styles['app-layout__dropdown-icon']" />
              Configurações
            </button>
            <div :class="styles['app-layout__dropdown-divider']" />
            <button
              @click="logout"
              :class="[
                styles['app-layout__dropdown-item'],
                styles['app-layout__dropdown-item--danger'],
              ]"
            >
              <LogOut :class="styles['app-layout__dropdown-icon']" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- ═════════════════════════════════════ MAIN ═════════════════════════════════════ -->
    <div :class="styles['app-layout__main']">
      
      <!-- Top Bar/Header -->
      <header :class="styles['app-layout__header']">
        <div :class="styles['app-layout__header-left']">
          <button
            :class="styles['app-layout__menu-btn']"
            @click="toggleSidebar"
            aria-label="Toggle sidebar"
          >
            <Menu v-if="!sidebarOpen" :class="styles['app-layout__menu-icon']" />
            <X v-else :class="styles['app-layout__menu-icon']" />
          </button>

          <!-- Search -->
          <div :class="styles['search-wrapper']">
            <Search :class="styles['app-layout__search-icon']" />
            <input
              v-model="searchQuery"
              placeholder="Buscar tarefas..."
              @keydown="handleSearch"
              :class="styles['app-layout__search-input']"
            />
          </div>
        </div>

        <!-- Right Actions -->
        <div :class="styles['app-layout__header-actions']">
          <!-- Notifications Button -->
          <button :class="styles['app-layout__icon-btn']" aria-label="Notifications">
            <div :class="styles['app-layout__notification-wrap']">
              <Bell :class="styles['app-layout__icon']" />
              <div
                v-if="hasNotifications"
                :class="styles['app-layout__notification-badge']"
              >
                {{ notificationCount }}
              </div>
            </div>
          </button>

          <!-- Help Button -->
          <button :class="styles['app-layout__icon-btn']" aria-label="Help">
            <HelpCircle :class="styles['app-layout__icon']" />
          </button>

          <!-- Divider -->
          <div :class="styles['app-layout__divider']" />

          <!-- User Avatar Dropdown -->
          <div ref="headerUserMenuEl" :class="styles['app-layout__user-dropdown']">
            <button
              @click="toggleUserDropdown"
              :class="styles['app-layout__header-avatar']"
              aria-haspopup="menu"
              :aria-expanded="userDropdownOpen"
            >
              <div :class="styles['app-layout__avatar-gradient']">
                {{ currentUser.initials }}
              </div>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="userDropdownOpen"
              :class="[
                styles['app-layout__dropdown'],
                styles['app-layout__dropdown--header'],
              ]"
            >
              <div :class="styles['app-layout__dropdown-header']">{{ currentUser.name }}</div>
              <button
                @click="navigate('/settings')"
                :class="styles['app-layout__dropdown-item']"
              >
                <Settings :class="styles['app-layout__dropdown-icon']" />
                Configurações
              </button>
              <div :class="styles['app-layout__dropdown-divider']" />
              <button
                @click="logout"
                :class="[
                  styles['app-layout__dropdown-item'],
                  styles['app-layout__dropdown-item--danger'],
                ]"
              >
                <LogOut :class="styles['app-layout__dropdown-icon']" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main :class="styles['app-layout__content']">
        <div :class="styles['app-layout__content-wrapper']">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
