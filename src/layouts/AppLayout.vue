<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
const dropdownOpen = ref(false)
const userDropdownOpen = ref(false)

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
</script>

<template>
  <div :class="styles['app-layout']">
    <!-- ═════════════════════════════════════ SIDEBAR ═════════════════════════════════════ -->
    <aside :class="styles['app-layout__sidebar']">
      
      <!-- Brand -->
      <div :class="styles['app-layout__brand']">
        <h1 :class="styles['app-layout__brand-title']">FocusFlow</h1>
        <p :class="styles['app-layout__brand-subtitle']">Productivity Platform</p>
      </div>

      <!-- Navigation -->
      <nav :class="styles['app-layout__nav']">
        <button
          v-for="item in navItems"
          :key="item.to"
          @click="navigate(item.to)"
          :class="[
            styles['app-layout__nav-item'],
            isActive(item.to) && styles['app-layout__nav-item--active']
          ]"
          :title="item.label"
        >
          <component :is="item.icon" :class="styles['app-layout__nav-icon']" />
          <span :class="styles['app-layout__nav-label']">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Sidebar Footer -->
      <div :class="styles['app-layout__sidebar-footer']">
        <!-- Focus Session Button -->
        <button
          @click="startFocusSession"
          :class="styles['app-layout__focus-btn']"
        >
          <Play class="w-4 h-4" />
          Focus Session
        </button>

        <!-- User Profile Dropdown -->
        <div>
          <button
            @click="toggleDropdown"
            :class="styles['app-layout__user-profile']"
          >
            <!-- Avatar -->
            <div :class="styles['app-layout__user-avatar']">
              <div style="
                width: 100%;
                height: 100%;
                border-radius: 8px;
                background: linear-gradient(135deg, #7c3aed, #0ea5e9);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: 600;
              ">
                {{ currentUser.initials }}
              </div>
            </div>

            <!-- User Info -->
            <div :class="styles['app-layout__user-info']">
              <p :class="styles['app-layout__user-name']">{{ currentUser.name }}</p>
              <p :class="styles['app-layout__user-plan']">{{ currentUser.plan }}</p>
            </div>

            <ChevronDown style="width: 16px; height: 16px; flex-shrink: 0;" />
          </button>

          <!-- Dropdown Menu -->
          <div v-if="dropdownOpen" style="
            position: absolute;
            bottom: -120px;
            left: 16px;
            right: 16px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 100;
            overflow: hidden;
          ">
            <button
              @click="navigate('/settings')"
              style="
                width: 100%;
                padding: 12px 16px;
                border: none;
                background: transparent;
                text-align: left;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 150ms;
              "
              @mouseenter="(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f3f4f6'"
              @mouseleave="(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'"
            >
              <Settings style="width: 16px; height: 16px; display: inline; margin-right: 8px;" />
              Configurações
            </button>
            <div style="height: 1px; background-color: #e5e7eb;" />
            <button
              @click="logout"
              style="
                width: 100%;
                padding: 12px 16px;
                border: none;
                background: transparent;
                text-align: left;
                font-size: 14px;
                cursor: pointer;
                color: #ef4444;
                transition: background-color 150ms;
              "
              @mouseenter="(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#fef2f2'"
              @mouseleave="(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'"
            >
              <LogOut style="width: 16px; height: 16px; display: inline; margin-right: 8px;" />
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

        <!-- Right Actions -->
        <div :class="styles['app-layout__header-actions']">
          <!-- Notifications Button -->
          <button :class="styles['app-layout__icon-btn']">
            <div style="position: relative;">
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
          <button :class="styles['app-layout__icon-btn']">
            <HelpCircle :class="styles['app-layout__icon']" />
          </button>

          <!-- Divider -->
          <div :class="styles['app-layout__divider']" />

          <!-- User Avatar Dropdown -->
          <div style="position: relative;">
            <button
              @click="toggleUserDropdown"
              :class="styles['app-layout__header-avatar']"
            >
              <div style="
                width: 100%;
                height: 100%;
                border-radius: 6px;
                background: linear-gradient(135deg, #7c3aed, #0ea5e9);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: 600;
              ">
                {{ currentUser.initials }}
              </div>
            </button>

            <!-- Dropdown Menu -->
            <div v-if="userDropdownOpen" style="
              position: absolute;
              top: 100%;
              right: 0;
              margin-top: 8px;
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
              z-index: 100;
              min-width: 200px;
              overflow: hidden;
            ">
              <div style="
                padding: 12px 16px;
                border-bottom: 1px solid #e5e7eb;
                font-weight: 500;
                font-size: 14px;
                color: #111827;
              ">
                {{ currentUser.name }}
              </div>
              <button
                @click="navigate('/settings')"
                style="
                  width: 100%;
                  padding: 12px 16px;
                  border: none;
                  background: transparent;
                  text-align: left;
                  font-size: 14px;
                  cursor: pointer;
                  color: #111827;
                  transition: background-color 150ms;
                "
                @mouseenter="(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f3f4f6'"
                @mouseleave="(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'"
              >
                <Settings style="width: 16px; height: 16px; display: inline; margin-right: 8px;" />
                Configurações
              </button>
              <div style="height: 1px; background-color: #e5e7eb;" />
              <button
                @click="logout"
                style="
                  width: 100%;
                  padding: 12px 16px;
                  border: none;
                  background: transparent;
                  text-align: left;
                  font-size: 14px;
                  cursor: pointer;
                  color: #ef4444;
                  transition: background-color 150ms;
                "
                @mouseenter="(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#fef2f2'"
                @mouseleave="(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'"
              >
                <LogOut style="width: 16px; height: 16px; display: inline; margin-right: 8px;" />
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
